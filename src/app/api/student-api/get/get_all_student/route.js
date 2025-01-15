import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/student-api/get/get_all_student

export async function GET() {
  try {
    const student = await prisma.student.findMany();
    // Return a JSON response with the fetched courses
    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}