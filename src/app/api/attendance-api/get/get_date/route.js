import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/attendance-api/get/get_date?course_id=001001

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("course_id");

    if (!courseId) {
      return NextResponse.json(
        { error: "Missing course_id parameter" },
        { status: 400 }
      );
    }

    const existingCourse = await prisma.course.findFirst({
      where: {
        course_id: courseId,
      },
    });

    if (!existingCourse) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
      });
    }

    const attendance_detail = await prisma.attendance_detail.findMany({
      where: {
        course_id: courseId,
      }
    });

    return NextResponse.json(attendance_detail);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}
