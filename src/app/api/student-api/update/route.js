import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma"; 
// http://localhost:3000/api/student-api/update
export async function PUT(req) {
  try {
    // Parse the JSON body to get the course data and ID
    const { id, student_name, student_id, faculty } = await req.json();

    // Validate that the required fields are provided
    if (!id) {
      return NextResponse.json(
        { error: "id are required fields." },
        { status: 400 }
      );
    }

    /////////////////////////////////////////////////
    // Mock teacher_id for now (replace with actual session logic later)
    const teacher_id = 1; // Replace with actual logic when auth is implemented

    const teacher = await prisma.user.findUnique({
      where: { id: teacher_id },
      select: { user_role: true },
    });

    if (!teacher) {
      return new Response(
        JSON.stringify({
          message: `User with ID ${teacher_id} not found`,
        }),
        { status: 404 }
      );
    }

    if (teacher.user_role !== "TEACHER") {
      return new Response(
        JSON.stringify({
          message: `User with ID ${teacher_id} is not a TEACHER`,
        }),
        { status: 403 }
      );
    }

    const existingStudent = await prisma.student.findUnique({
      where: { id },
    });

    if (!existingStudent) {
      return new Response(
        JSON.stringify({
          message: `Student with ID ${id} isn't exists`,
        }),
        { status: 404 }
      );
    }
    /////////////////////////////////////////////////

    // Prepare the data to be updated, ensuring null values are allowed
    const updateData = {
      student_name:
        student_name !== undefined ? student_name : existingStudent.student_name, 
      student_id:
        student_id !== undefined ? student_id : existingStudent.student_id, 
      faculty:
        faculty !== undefined ? faculty : existingStudent.faculty
    };

    // Update the course using Prisma's update method
    const updatedStudent = await prisma.student.update({
      where: { id }, 
      data: updateData,
    });

    return NextResponse.json({
      message: "Student updated successfully",
      updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Error updating student" },
      { status: 500 }
    );
  }
}
