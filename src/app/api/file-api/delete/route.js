import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import fs from "fs";
import path from "path";

// DELETE API for deleting a file by file_name and course_id
// http://localhost:3000/api/file-api/delete?file_name=test.xlsx&course_id=001001&section=001
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("file_name");
    const courseId = searchParams.get("course_id");
    const section = searchParams.get("section");

    if (!fileName || !courseId || !section) {
      return NextResponse.json(
        { error: "file_name and course_id and section are required" },
        { status: 400 }
      );
    }

    // Find the file in the database
    const file = await prisma.file.findFirst({
      where: { file_name: fileName, course_id: courseId, section: section },
    });

    if (!file) {
      return NextResponse.json(
        { error: `File with name ${fileName} does not exist in ${courseId} section ${section}` },
        { status: 404 }
      );
    }

    // Construct the file path
    const filePath = path.join(process.cwd(), "public/uploads", fileName);

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
      message: `File ${fileName} associated with course_id ${courseId} in section ${section} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Error deleting file" },
      { status: 500 }
    );
  }
}
