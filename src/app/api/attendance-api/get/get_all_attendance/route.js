import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/attendance-api/get/get_all_attendance

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_email = searchParams.get("user_email");
    
    if (!user_email) {
      return NextResponse.json(
        { message: "user_email are required" },
        { status: 400 }
      );
    }

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

    if (teacher.user_role !== "TEACHER" & teacher.user_role !== "TA") {
      return new Response(
        JSON.stringify({
          message: `User with email ${user_email} is not a TEACHER or TA`,
        }),
        { status: 403 }
      );
    }

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
