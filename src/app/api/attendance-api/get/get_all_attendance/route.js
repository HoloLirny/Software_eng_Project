import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/attendance-api/get/get_all_attendance

export async function GET() {
  try {
    const attendance = await prisma.attendance.findMany({
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
