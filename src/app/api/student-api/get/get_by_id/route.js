import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/student-api/get/get_by_id?student_id=650610769&user_email=teacher@example.com

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get("student_id");
    const user_email = searchParams.get("user_email");
    const teacher = await prisma.user.findUnique({
      where: { email: user_email }
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

    if (!student_id) {
      return NextResponse.json(
        { error: "student_id is required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
        where: { student_id: student_id }, 
        include: {
        attendances: true, 
        },
    });
  

    if (!student) {
      return NextResponse.json(
        { error: "student with this id not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}