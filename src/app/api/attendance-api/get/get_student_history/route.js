import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/attendance-api/get/get_student_history?student_id=650610000

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get("student_id");

<<<<<<< HEAD
    if (!user_email|| !student_id) {
=======
    if (!student_id) {
>>>>>>> 1fdc07e7fc82db24daea4ad2c4d12b1f89d3a4eb
      return NextResponse.json(
        { error: "Missing student_id parameter" },
        { status: 400 }
      );
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        student_id: student_id,
      },
      include: {
        attendance_detail: {
          select: {
            date: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}
