import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import prisma from "../../../../../prisma/prisma";

// Configure the file upload directory
const uploadDir = path.join(process.cwd(), "public/uploads");

export async function POST(request) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file");
    const courseId = formData.get("course_id");
    const user_email = formData.get("user_email");

    ////////////////////////////////////////////////////
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
    ////////////////////////////////////////////////////

    if (!file || !file.name || !courseId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingCourse = await prisma.course.findUnique({
      where: { course_id: courseId },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: `Course with ID ${courseId} not found` },
        { status: 404 }
      );
    }

    // Save the file to the server
    const filePath = path.join(uploadDir, file.name);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);

    const existingFile = await prisma.file.findFirst({
      where: {
        file_name: file.name,
        course_id: courseId,
      },
    });

    if (existingFile) {
      const updatedFile = await prisma.file.update({
        where: { id: existingFile.id },
        data: {
          file_url: `/public/uploads/${file.name}`,
          uploaded_by: teacher.id,
        },
      });
      console.log("File updated:", updatedFile);
    } else {
      const savedFile = await prisma.file.create({
        data: {
          file_name: file.name,
          file_url: `/public/uploads/${file.name}`,
          course_id: courseId,
          uploaded_by: teacher.id,
        },
      });
      console.log("File uploaded successfully:", savedFile);
    }

    return NextResponse.json({
      success: true,
      fileUrl: `/public/uploads/${file.name}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
