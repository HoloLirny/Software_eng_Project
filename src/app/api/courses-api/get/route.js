import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

export async function GET() {
  try {
    // Fetch all courses with related data
    const courses = await prisma.course.findMany({
      include: {
        user_courses: {
          include: {
            user: true, // Include user details for the user_course
          },
        },
        course_students: {
          include: {
            student: true, // Include student details for the course_student
          },
        },
        files: true, // Include files related to the course
        attendances: true, // Include attendances related to the course
      },
    });

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
