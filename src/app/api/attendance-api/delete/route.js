import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

// http://localhost:3000/api/attendance-api/delete?course_id=001001
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const course_id = searchParams.get("course_id");

    if (!course_id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    ///////////////////////////////////////////////
    // Mock teacher_id for now (replace with actual session logic later)
    const teacher_id = 1; // Replace with actual authentication logic

    const teacher = await prisma.user.findUnique({
      where: { id: teacher_id },
      select: { user_role: true },
    });

    if (!teacher) {
      return NextResponse.json(
        { message: `User with ID ${teacher_id} not found` },
        { status: 404 }
      );
    }

    if (teacher.user_role !== "TEACHER") {
      return NextResponse.json(
        { message: `User with ID ${teacher_id} is not a TEACHER` },
        { status: 403 }
      );
    }
    ///////////////////////////////////////////////////////

    const existingCourse = await prisma.course.findUnique({
      where: { course_id },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { message: `Course with course_id ${course_id} doesn't exist` },
        { status: 404 }
      );
    }

    // Find all attendance records for the given course_id
    const attendanceRecords = await prisma.attendance.findMany({
      where: { course_id },
      select: { id: true },
    });

    if (attendanceRecords.length === 0) {
      return NextResponse.json(
        { message: `No attendance records found for course_id ${course_id}` },
        { status: 404 }
      );
    }

    // Extract attendance IDs
    const attendanceIds = attendanceRecords.map((att) => att.id);

    // Delete related attendance_detail first
    await prisma.attendance_detail.deleteMany({
      where: { attendance_id: { in: attendanceIds } },
    });

    // Delete attendance records
    const deletedAttendance = await prisma.attendance.deleteMany({
      where: { course_id },
    });

    return NextResponse.json({
      message: `Attendance records for course_id ${course_id} deleted successfully`,
      deletedAttendance,
    });

  } catch (error) {
    console.error("Error deleting attendance:", error);
    return NextResponse.json(
      { error: "Error deleting attendance", details: error.message },
      { status: 500 }
    );
  }
}
