import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/ta-api/get/get_all_ta?user_email=teacher@example.com

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_email = searchParams.get("user_email");
    
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

    const TA = await prisma.user.findMany({
      where: { user_role: "TA" },
      select: {
        id: true, 
        email: true,
        user_role: true,
      },
    });
    return NextResponse.json(TA);
  } catch (error) {
    console.error("Error fetching ta:", error);
    return NextResponse.json(
      { error: "Failed to fetch ta" },
      { status: 500 }
    );
  }
}
