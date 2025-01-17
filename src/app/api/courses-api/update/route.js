import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma"; 
// http://localhost:3000/api/courses-api/update
export async function PUT(req) {
  try {
    // Parse the JSON body to get the course data and ID
    const { id, course_id, course_name, total_student, scan_time, teacher_id } = await req.json();

    // Validate that the required fields are provided
    if (!id) {
      return NextResponse.json(
        { error: "id are required fields." },
        { status: 400 }
      );
    }

    /////////////////////////////////////////////////
    // Mock teacher_id for now (replace with actual session logic later)
    const user_id = 1; // Replace with actual logic when auth is implemented

    const teacher = await prisma.user.findUnique({
      where: { id: user_id },
      select: { user_role: true },
    });

    if (!teacher) {
      return new Response(
        JSON.stringify({
          message: `User with ID ${user_id} not found`,
        }),
        { status: 404 }
      );
    }

    if (teacher.user_role !== "TEACHER" && teacher.user_role !== "TA") {
      return new Response(
        JSON.stringify({
          message: `User with ID ${user_id} is not a TEACHER or TA`,
        }),
        { status: 403 }
      );
    }

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
    /////////////////////////////////////////////////

    // Prepare the data to be updated, ensuring null values are allowed
    const updateData = {
      course_name:
        course_name !== undefined ? course_name : existingCourse.course_name, 
      teacher_id:
        teacher_id !== undefined ? teacher_id : existingCourse.teacher_id, 
      total_student:
        total_student !== undefined
          ? total_student
          : existingCourse.total_student, 
      scan_time:
        scan_time !== undefined ? scan_time : existingCourse.total_student, 
      course_id: 
        course_id !== undefined ? course_id : existingCourse.course_id, 
    };

    // Update the course using Prisma's update method
    const updatedCourse = await prisma.course.update({
      where: { id }, // Identify the course to update by ID
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
