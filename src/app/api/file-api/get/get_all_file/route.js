import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/file-api/get/get_all_file

export async function GET() {
  try {
    const file = await prisma.file.findMany();
    return NextResponse.json(file);
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
  }
}
