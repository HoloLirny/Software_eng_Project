import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
// http://localhost:3000/api/ta-api/update
export async function PUT(req) {
  try {
    const { id, course_id, email, user_email } = await req.json();

    // Validate that the required fields are provided
    if (!id || !user_email) {
      return NextResponse.json(
        { error: "id and user_email are required fields." },
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

    if (teacher.user_role !== "TEACHER") {
      return new Response(
        JSON.stringify({
          message: `User with email ${user_email} is not a TEACHER`,
        }),
        { status: 403 }
      );
    }

    const existingta = await prisma.user.findUnique({
      where: { id },
      include: { user_courses: true },
    });

    if (!existingta) {
      return NextResponse.json({ error: "ta not found" }, { status: 404 });
    }

    // Prepare the data to be updated, ensuring null values are allowed
    const updateData = {
      email: email !== undefined ? email : existingta.email,
    };

    let newUserCourse = null;

    // If a course_id is provided, check if it's already assigned
    if (course_id !== undefined) {
      const course = await prisma.course.findUnique({
        where: { course_id: course_id },
      });

      if (!course) {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }

      const isAlreadyAssigned = existingta.user_courses.some(
        (uc) => uc.course_id === course_id
      );

      if (!isAlreadyAssigned) {
        // If the TA isn't assigned to this course yet, add it
        newUserCourse = await prisma.user_course.create({
          data: {
            user_id: id,
            course_id,
          },
        });
      } else {
        return NextResponse.json(
          { error: "ta already assigned to this course" },
          { status: 400 }
        );
      }
    }

    // Update the course using Prisma's update method
    const updateta = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "TA updated successfully",
      updateta,
    });
  } catch (error) {
    console.error("Error updating ta:", error);
    return NextResponse.json({ error: "Error updating ta" }, { status: 500 });
  }
}
