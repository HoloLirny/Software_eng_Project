import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import prisma from "../../../../../prisma/prisma";

// Configure the file upload directory
const uploadDir = path.join(process.cwd(), "public/uploads");

export async function POST(request) {
  try {
    // Mock teacher_id for now (replace with actual session logic later)
    const teacher_id = 1; // Replace with actual logic when auth is implemented

    const teacher = await prisma.user.findUnique({
      where: { id: teacher_id },
      select: { user_role: true },
    });

    if (!teacher) {
      return new Response(
        JSON.stringify({
          message: `User with ID ${teacher_id} not found`,
        }),
        { status: 404 }
      );
    }
    // Only teacher can add file
    if (teacher.user_role !== "TEACHER") {
      return new Response(
        JSON.stringify({
          message: `User with ID ${teacher_id} is not a TEACHER`,
        }),
        { status: 403 }
      );
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file");
    const courseId = formData.get("course_id");

    if (!file || !file.name || !courseId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save the file to the server
    const filePath = path.join(uploadDir, file.name);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);

    // Save file metadata to the database
    const savedFile = await prisma.file.create({
      data: {
        file_name: file.name,
        file_url: `/uploads/${file.name}`,
        course_id: courseId,
        uploaded_by: teacher_id,
      },
    });

    return NextResponse.json({ success: true, data: savedFile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
