import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import fs from "fs";
import path from "path";

// http://localhost:3000/api/courses-api/delete?course_id=001001&user_email=teacher@example.com
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("course_id");
    const user_email = searchParams.get("user_email");

    if (!id || !user_email) {
      return NextResponse.json(
        { error: "Course ID and User email are required" },
        { status: 400 }
      );
    }

    const teacher = await prisma.user.findUnique({
      where: { email: user_email },
    });

    if (!teacher) {
      return new Response(
        JSON.stringify({
          message: `User with email ${user_email}} not found`,
        }),
        { status: 404 }
      );
    }

    if (teacher.user_role !== "TEACHER") {
      return new Response(
        JSON.stringify({
          message: `User with email ${user_email} is not a TEACHER`,
        }),
        { status: 403 }
      );
    }
    
    const existingCourse = await prisma.course.findUnique({
      where: { course_id: id },
    });

    if (!existingCourse) {
      return new Response(
        JSON.stringify({
          message: `Course with course_id ${id} doesn't exist`,
        }),
        { status: 404 }
      );
    }

    // Fetch associated files
    const files = await prisma.file.findMany({
      where: { course_id: id },
    });

    // Delete physical files
    files.forEach((file) => {
      const filePath = path.join(process.cwd(), "public/uploads", file.file_name);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); 
      }
    });

    // Delete the course (cascades to related records in the database)
    const deletedCourse = await prisma.course.delete({
      where: { course_id: id },
    });

    return NextResponse.json({
      message: "Course and related data deleted successfully",
      deletedCourse,
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Error deleting course" },
      { status: 500 }
    );
  }
}
