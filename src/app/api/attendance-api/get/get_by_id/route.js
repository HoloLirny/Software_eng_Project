import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/attendance-api/get/get_by_id?course_id=261361&user_email=teacher@example.com&date=01-01-2022

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("course_id");
    const user_email = searchParams.get("user_email");
    const date = searchParams.get("date");

    if (!courseId || !user_email || !date) {
      return NextResponse.json(
        { error: "Missing course_id, date and user email parameter" },
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

    const exitingdate = await prisma.attendance_detail.findFirst({
      where: { date: date, course_id: courseId },
    });

    if (!exitingdate) {
      return NextResponse.json(
        { error: "Date not found" },
        { status: 404 }
      );
    }

    const exitingcouse = await prisma.course.findFirst({
      where: {
        course_id: courseId,
      },
    });

    if (!exitingcouse) {   
        return NextResponse.json(
            { error: "Course not found" },
            { status: 404 }
        );
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        course_id: courseId, 
        detail_id: exitingdate.id
      },
      include: {
        attendance_detail: {
          select: {
            date: true,
            description: true,
          },
        },
        student: {
          select: {
            student_name: true,
	    student_id: true,
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
