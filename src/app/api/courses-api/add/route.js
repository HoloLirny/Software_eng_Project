import prisma from "../../../../../prisma/prisma";
// Thing left to do
// connect with auth that link id of logined user 

export async function POST(req) {
  try {
    const { course_id, course_name, total_student, scan_time } = await req.json();

    // Validate required fields
    if (!course_id || !course_name) {
      return new Response(
        JSON.stringify({
          message: "Course ID and course name are required",
        }),
        { status: 400 }
      );
    }

    // Mock teacher_id for now (replace with actual session logic later)
    const teacher_id = 1; // Replace with actual logic when auth is implemented

    const teacher = await prisma.user.findUnique({
      where: { id: teacher_id },
      select: { user_role: true },
    });

    if (!teacher) {
      return new Response(
        JSON.stringify({
          message: `User with ID ${teacher_id} not found`,
        }),
        { status: 404 }
      );
    }

    if (teacher.user_role !== "TEACHER") {
      return new Response(
        JSON.stringify({
          message: `User with ID ${teacher_id} is not a TEACHER`,
        }),
        { status: 403 }
      );
    }

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
          teacher_id,
          total_student,
          scan_time,
        },
      }),
      prisma.user_course.create({
        data: {
          user_id: teacher_id, // Replace with actual user ID later
          course_id: course_id,
        },
      }),
    ]);

    return new Response(
      JSON.stringify({ newCourse, userCourse: adduser_course }),
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
