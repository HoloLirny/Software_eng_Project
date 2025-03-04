import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

// http://localhost:3000/api/ta-api/delete?user_email=teacher@example.com&ta_email=win@gmail.com
export async function DELETE(req) {
  try {
    const { course_id, ta_email, user_email } = await req.json();

    if (!user_email || !ta_email) {
      return NextResponse.json(
        { error: "user_email and ta_email are required" },
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

    const ta = await prisma.user.findUnique({
      where: { email: ta_email },
    });

    if (!ta) {
      return NextResponse.json(
        { error: `TA with email ${ta_email} does not exist` },
        { status: 404 }
      );
    }

    if (ta.user_role !== "TA") {
      return NextResponse.json(
        { error: `User with email ${ta_email} is not a TA` },
        { status: 400 }
      );
    }

    const taexistincourse = await prisma.user_course.findFirst({
      where: { course_id: course_id, user_id: ta.id },
    });

    if (!taexistincourse) {
      return NextResponse.json(
        { error: `TA with email ${ta_email} does not exist in this course` },
        { status: 404 }
    );}

    // Delete the TA
    const deletedTA = await prisma.user_course.deleteMany({
      where: { course_id: course_id, user_id: ta.id },
    });

    return NextResponse.json(
      { message: "TA deleted successfully", deletedTA },
      { status: 200 });

  } catch (error) {
    console.error("Error deleting TA:", error);
    return NextResponse.json(
      { error: "Error deleting TA" },
      { status: 500 }
    );
  }
}
