import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/file-api/get/get_by_id?course_id=001001&section=001
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("course_id");
    const section = searchParams.get("section");

    if (!courseId || !section) {
      return NextResponse.json(
        { error: "Course ID and section are required" },
        { status: 400 }
      );
    }

    // Fetch files by course_id
    const files = await prisma.file.findMany({
      where: { course_id: courseId, section: section },
    });

    if (files.length === 0) {
      return NextResponse.json(
        { message: `No files found for course_id ${courseId} of section ${section}` },
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
