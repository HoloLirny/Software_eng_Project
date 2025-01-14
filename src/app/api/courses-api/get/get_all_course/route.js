import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/courses-api/get/get_all_course

export async function GET() {
  try {
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
