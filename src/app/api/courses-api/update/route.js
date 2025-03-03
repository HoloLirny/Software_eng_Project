import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma"; 
// http://localhost:3000/api/courses-api/update
export async function PUT(req) {
  try {
    // Parse the JSON body to get the course data and ID
    const { id, course_id, course_name, scan_time, teacher_id, user_email } = await req.json();

    // Validate that the required fields are provided
    if (!id || !user_email) {
      return NextResponse.json(
        { error: "id and user_email are required fields." },
        { status: 400 }
      );
    }

    /////////////////////////////////////////////////
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
    /////////////////////////////////////////////////
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return new Response(
        JSON.stringify({
          message: `Course with ID ${id} isn't exists`,
        }),
        { status: 404 }
      );
    }

    // Prepare the data to be updated, ensuring null values are allowed
    const updateData = {
      course_name:
        course_name !== undefined ? course_name : existingCourse.course_name, 
      teacher_id:
        teacher_id !== undefined ? teacher_id : existingCourse.teacher_id, 
      scan_time:
        scan_time !== undefined ? scan_time : existingCourse.total_student, 
      course_id: 
        course_id !== undefined ? course_id : existingCourse.course_id, 
    };

    // Update the course using Prisma's update method
    const updatedCourse = await prisma.course.update({
      where: { id }, 
      data: updateData,
    });

    return NextResponse.json({
      message: "Course updated successfully",
      updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Error updating course" },
      { status: 500 }
    );
  }
}
