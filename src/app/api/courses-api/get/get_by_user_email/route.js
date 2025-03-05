import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/courses-api/get/get_by_user_email?user_email=teacher@example.com

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_email = searchParams.get("user_email");

    if (!user_email) {
      return NextResponse.json(
        { error: "email is required" },
        { status: 400 }
      );
    }

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

    if (teacher.user_role !== "TEACHER" & teacher.user_role !== "TA") {
      return new Response(
        JSON.stringify({
          message: `User with email ${user_email} is not a TEACHER or TA`,
        }),
        { status: 403 }
      );
    }
    
    const course = await prisma.user_course.findMany({
        where: { user_id: teacher.id }, 
        include: { course: true }
    });
  
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Return a JSON response with the fetched course
    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
