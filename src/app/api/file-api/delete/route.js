import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import fs from "fs";
import path from "path";

// http://localhost:3000/api/file-api/delete
export async function DELETE(req) {
  try {
    const { file_name,course_id, user_email } = await req.json();

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

    if (!file_name || !course_id) {
      return NextResponse.json(
        { error: "file_name and course_id are required" },
        { status: 400 }
      );
    }

    // Find the file in the database
    const file = await prisma.file.findFirst({
      where: { file_name: file_name, course_id: course_id },
    });

    if (!file) {
      return NextResponse.json(
        { error: `File with name ${file_name} does not exist in ${course_id}` },
        { status: 404 }
      );
    }

    // Construct the file path
    const filePath = path.join(process.cwd(), "public/uploads", file_name);

    // Delete the physical file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn(`File ${filePath} does not exist on the server`);
    }

    // Delete the file record from the database
    await prisma.file.delete({
      where: {
        id: file.id,
      },
    });

    return NextResponse.json({
      message: `File ${file_name} associated with course_id ${course_id} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Error deleting file" },
      { status: 500 }
    );
  }
}
