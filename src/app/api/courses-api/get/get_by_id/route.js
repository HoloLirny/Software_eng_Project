import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/courses-api/get/get_by_id?course_id=002002

export async function GET(request) {
  try {
    // Extract course_id from the query parameters
    const { searchParams } = new URL(request.url);
    const course_id = searchParams.get("course_id");

    if (!course_id) {
      return NextResponse.json(
        { error: "course_id is required" },
        { status: 400 }
      );
    }

    // Fetch course information by course_id
    const course = await prisma.course.findUnique({
        where: { course_id: course_id }, 
        include: {
        user_courses: {
            include: {
            user: true, 
            },
        },
        files: true, 
        attendances: true, 
        },
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
