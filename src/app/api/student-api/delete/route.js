import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
// http://localhost:3000/api/student-api/delete

export async function DELETE(req) {
  try {
    const {
      student_id, course_id, user_email
    } = await req.json();

    if (!student_id || !user_email || !course_id) {
      return NextResponse.json(
        { error: "student_id, course_id, user_email are required" },
        { status: 400 }
      );
    }
    ///////////////////////////////////////////////////////
    const teacher = await prisma.user.findUnique({
      where: { email: user_email },
    });

    if (!teacher) {
      return new Response(
        JSON.stringify({
          message: `User with email ${user_email}} not found`,
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
    ///////////////////////////////////////////////////////
    const existingStudent = await prisma.student.findUnique({
      where: { student_id },
    });

    if (!existingStudent) {
      return new Response(
        JSON.stringify({
          message: `Student with student_id ${student_id} isn't exists`,
        }),
        { status: 404 }
      );
    }

    const existingCourse = await prisma.course.findUnique({
      where: { course_id },
    });

    if (!existingCourse) {
      return new Response(
        JSON.stringify({
          message: `Course with course_id ${course_id} not found`,
        }),
        { status: 404 }
      );
    }
 
    const deleteStudent = await prisma.student_course.delete({
      where: { student_id_course_id: { student_id, course_id } }
    });

    const deleteStudentAttendance = await prisma.attendance.deleteMany({
      where: { student_id, course_id } 
    });
    
    return NextResponse.json({
      message: "Student and related data deleted successfully",
      deleteStudent,
      deleteStudentAttendance
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Error deleting student" },
      { status: 500 }
    );
  }
}
