import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
// http://localhost:3000/api/student-api/delete?student_id=650610747
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("student_id");

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }
    ///////////////////////////////////////////////////////
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
    ///////////////////////////////////////////////////////
    const existingStudent = await prisma.student.findUnique({
      where: { student_id: id },
    });

    if (!existingStudent) {
      return new Response(
        JSON.stringify({
          message: `Student with student_id ${id} isn't exists`,
        }),
        { status: 404 }
      );
    }
 
    const deleeteStudent = await prisma.student.delete({
      where: { student_id: id },
    });

    return NextResponse.json({
      message: "Student and related data deleted successfully",
      deleeteStudent,
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Error deleting student" },
      { status: 500 }
    );
  }
}
