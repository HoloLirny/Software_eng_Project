import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/student-api/get/get_by_course_id?course_id=261361

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const course_id = searchParams.get("course_id");

    if (!course_id) {
      return NextResponse.json(
        { error: "course_id is required" },
        { status: 400 }
      );
    }

    const students = await prisma.student_course.findMany({
      where: { course_id: course_id },
      select: {
        student_id: true,
        student: {
          select: {
            student_name: true,
          },
        },
      },
    });

    if (students.length === 0) {
      return NextResponse.json(
        { error: `No students found for course ${course_id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
