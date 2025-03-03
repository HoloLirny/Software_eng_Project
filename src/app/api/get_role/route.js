import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";

// http://localhost:3000/api/get_role?email=teacher@example.com

export async function GET(request) {
  try {
    // Extract course_id from the query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "email is required" },
        { status: 400 }
      );
    }

    const role = await prisma.user.findUnique({
        where: { email: email }, 
        select: {
            user_role: true
        }
    });

    if (!role) {   
        return NextResponse.json("STUDENT", { status: 200 });
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
