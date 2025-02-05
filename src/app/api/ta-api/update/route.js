import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma"; 
// http://localhost:3000/api/ta-api/update
export async function PUT(req) {
  try {
    // Parse the JSON body to get the course data and ID
    const { id, course_id, email } = await req.json();

    // Validate that the required fields are provided
    if (!id) {
      return NextResponse.json(
        { error: "id are required fields." },
        { status: 400 }
      );
    }

    const existingta = await prisma.user.findUnique({
      where: { id },
      include: { user_courses: true },
    });

    if (!existingta) {
        return NextResponse.json(
            { error: "ta not found" },
            { status: 404 }
        );
    }

    // Prepare the data to be updated, ensuring null values are allowed
    const updateData = {
      email: email !== undefined ? email : existingta.email,
    };

    let newUserCourse = null;

    // If a course_id is provided, check if it's already assigned
    if (course_id !== undefined) {
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
      }else{
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
    return NextResponse.json(
      { error: "Error updating ta" },
      { status: 500 }
    );
  }
}
