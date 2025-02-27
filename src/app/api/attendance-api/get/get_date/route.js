import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/attendance-api/get/get_date?course_id=001001

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("course_id");

    if (!courseId) {
      return NextResponse.json(
        { error: "Missing course_id parameter" },
        { status: 400 }
      );
    }

    const existingCourse = await prisma.course.findFirst({
      where: {
        course_id: courseId,
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        course_id: courseId,
      },
      select: {
        attendance_detail: true, // ดึง attendance_detail ทั้ง object
      },
    });

    // ตรวจสอบว่า attendance_detail เป็น array หรือ object แล้วดึง date
    const dates = attendance
      .map(item => item.attendance_detail?.date) // เข้าถึง date โดยตรง
      .filter(date => date !== undefined); // กรองค่า undefined ออก

    return NextResponse.json(dates);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}
