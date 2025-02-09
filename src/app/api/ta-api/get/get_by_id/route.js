import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/ta-api/get/get_by_id?course_id=001001

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

    const course = await prisma.course.findUnique({
      where: { course_id: course_id },
    });

    if(!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    const TA = await prisma.user.findMany({
        where: {
          user_role: "TA",
          user_courses: {
            some: {
              course_id: course_id,
            },
          },
        },
        select: {
          id: true,
          email: true,
          user_role: true,
        },
      });

    return NextResponse.json(TA);
  } catch (error) {
    console.error("Error fetching ta:", error);
    return NextResponse.json(
      { error: "Failed to fetch ta" },
      { status: 500 }
    );
  }
}