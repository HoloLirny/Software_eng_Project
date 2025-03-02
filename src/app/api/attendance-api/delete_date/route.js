import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

// http://localhost:3000/api/attendance-api/delete_date
export async function DELETE(req) {
  try {
    const { date, course_id } = await req.json();

    if (!course_id || !date) {
      return NextResponse.json(
        { error: "Course ID and Date is required" },
        { status: 400 }
      );
    }

    // Find all attendance records for the given course_id
    const delete_date = await prisma.attendance_detail.findFirst({
      where: { course_id, date },
    });

    if (!delete_date) {
      return NextResponse.json(
        { message: `No attendance_detail records found for course_id ${course_id}` },
        { status: 404 }
      );
    }
    // Delete related attendance_detail first
    await prisma.attendance_detail.delete({
      where: { id: delete_date.id },
    });

    return NextResponse.json({
      message: `Attendance records for course_id ${course_id} deleted successfully`,
      delete_date,
    });

  } catch (error) {
    console.error("Error deleting attendance:", error);
    return NextResponse.json(
      { error: "Error deleting attendance", details: error.message },
      { status: 500 }
    );
  }
}
