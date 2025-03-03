import prisma from "../../../../../prisma/prisma";

// http://localhost:3000/api/courses-api/add

export async function POST(req) {
  try {
    const { course_id, course_name, scan_time, user_email } = await req.json();

    // Validate required fields
    if (!course_id || !course_name) {
      return new Response(
        JSON.stringify({
          message: "Course ID and course name are required",
        }),
        { status: 400 }
      );
    }
    ///////////////////////////////////////////////////////
    const teacher = await prisma.user.findUnique({
      where: { email: user_email }
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

    const existingCourse = await prisma.course.findUnique({
      where: { course_id },
    });

    if (existingCourse) {
      return new Response(
        JSON.stringify({
          message: `Course with ID ${course_id} already exists`,
        }),
        { status: 400 }
      );
    }

    const [newCourse, adduser_course] = await prisma.$transaction([
      prisma.course.create({
        data: {
          course_id,
          course_name,
          teacher_id: teacher.id,
          scan_time,
        },
      }),
      prisma.user_course.create({
        data: {
          user_id: teacher.id, 
          course_id: course_id,
        },
      }),
    ]);

    return new Response(
      JSON.stringify({
        message: "Course and related data added successfully",
        newCourse,
        userCourse: adduser_course
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding course:", error);
    return new Response(
      JSON.stringify({
        message: "An error occurred while adding the course",
        error: error.message || "Internal Server Error",
      }),
      { status: 500 }
    );
  }
}
