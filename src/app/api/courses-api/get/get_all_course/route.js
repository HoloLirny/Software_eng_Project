import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/courses-api/get/get_all_course?user_email=teacher@example.com

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
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

    const courses = await prisma.course.findMany();
    // Return a JSON response with the fetched courses
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
