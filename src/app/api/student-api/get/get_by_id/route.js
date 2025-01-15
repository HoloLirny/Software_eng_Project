import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/student-api/get/get_by_id?student_id=650610769

export async function GET(request) {
  try {
    // Extract student_id from the query parameters
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get("student_id");

    if (!student_id) {
      return NextResponse.json(
        { error: "student_id is required" },
        { status: 400 }
      );
    }

    // Fetch course information by course_id
    const student = await prisma.student.findUnique({
        where: { student_id: student_id }, // Specify the course_id condition
        include: {
        attendances: true, // Include attendances related to the course
        },
    });
  

    if (!student) {
      return NextResponse.json(
        { error: "student with this id not found" },
        { status: 404 }
      );
    }

    // Return a JSON response with the fetched course
    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}