import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/attendance-api/get/get_by_id?course_id=001001

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
