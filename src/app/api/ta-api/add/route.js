import prisma from "../../../../../prisma/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { course_id, email, user_email } = await req.json();
    const existingEmailUser = await prisma.user.findUnique({
      where: { email },
    });

    const existingCourse = await prisma.course.findUnique({
      where: { course_id },
    });

    if (!existingCourse) {
      return new Response(
        JSON.stringify({
          message: `Course with ID ${course_id} not found`,
        }),
        { status: 404 }
      );
    }

    ///////////////////////////////////////////////////
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
    ///////////////////////////////////////////////////

    if (existingEmailUser) {
      const existInUser_course = await prisma.user_course.findFirst({
        where: { user_id: existingEmailUser.id, course_id: course_id },
      });

      if (existInUser_course) {
        return new Response(
          JSON.stringify({ message: "This TA already in the course" }),
          { status: 500 }
        );
      }
      if (existingEmailUser.user_role == "TA") {
        const addToUserCourse = await prisma.user_course.create({
          data: {
            user_id: existingEmailUser.id,
            course_id: course_id,
          },
        });
        return new Response(JSON.stringify({ addToUserCourse }), {
          status: 201,
        });
      }
      return new Response(JSON.stringify({ message: "User isn't the TA" }), {
        status: 500,
      });
    }

    const newTA = await prisma.user.create({
      data: {
        email,
        user_role: "TA",
      },
    });

    const addToUserCourse = await prisma.user_course.create({
      data: {
        user_id: newTA.id,
        course_id: course_id,
      },
    });

    return new Response(JSON.stringify({ newTA, addToUserCourse }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
    });
  }
}
