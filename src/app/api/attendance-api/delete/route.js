import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

// http://localhost:3000/api/attendance-api/delete?course_id=261361&user_email=teacher@example.com
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const course_id = searchParams.get("course_id");
    const user_email = searchParams.get("user_email");

    if (!course_id || !user_email) {
      return NextResponse.json(
        { error: "Course ID and User Email are required" },
        { status: 400 }
      );
    }

    ///////////////////////////////////////////////
    const teacher = await prisma.user.findUnique({
      where: { email: user_email },
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
      select: { detail_id: true },
    });

    if (attendanceRecords.length === 0) {
      return NextResponse.json(
        { message: `No attendance records found for course_id ${course_id}` },
        { status: 404 }
      );
    }

    // Delete related attendance_detail first
    await prisma.attendance_detail.deleteMany({
      where: { id: { in: attendanceRecords.detail_id } },
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
