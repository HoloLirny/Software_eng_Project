import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/file-api/get/get_path_by_id?course_id=261361&user_email=teacher@example.com

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("course_id");
    const user_email = searchParams.get("user_email");
    const teacher = await prisma.user.findUnique({
      where: { email: user_email },
    });

    if (!teacher) {
      return new Response(
        JSON.stringify({
          message: `User with email ${user_email} not found`,
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
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID are required" },
        { status: 400 }
      );
    }

      // Fetch files by course_id
    const files = await prisma.file.findMany({
      where: { 
        course_id: courseId, 
        file_name: `attendance_data_${courseId}.xlsx`, 
      },
      select:{
        file_url: true,
      }
    });


    if (files.length === 0) {
      return NextResponse.json(
        { message: `No attendance files found for course_id ${courseId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Files fetched successfully",
      files,
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Error fetching files" },
      { status: 500 }
    );
  }
}
