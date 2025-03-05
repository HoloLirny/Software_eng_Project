import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/attendance-api/get/get_student_history?student_id=650610000&user_email=teacher@example.com

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get("student_id");
    const user_email = searchParams.get("user_email");

    if (!user_email|| !student_id) {
      return NextResponse.json(
        { error: "Missing course_id and user email parameter" },
        { status: 400 }
      );
    }

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

    if (teacher.user_role !== "TEACHER" & teacher.user_role !== "TA") {
      return new Response(
        JSON.stringify({
          message: `User with email ${user_email} is not a TEACHER or TA`,
        }),
        { status: 403 }
      );
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        student_id: student_id,
      },
      include: {
        attendance_detail: {
          select: {
            date: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}
