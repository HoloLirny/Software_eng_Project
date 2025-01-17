import prisma from "../../../../../prisma/prisma";

export async function POST(req) {
  try {
    const { student_id, faculty, student_name } = await req.json();

    // // Check if the course exists
    // const existingCourse = await prisma.course.findUnique({
    //   where: { course_id },
    // });
    // if (!existingCourse) {
    //   return new Response(
    //     JSON.stringify({ error: "Course does not exist." }),
    //     { status: 400 }
    //   );
    // }

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
    // Only teacher can add student
    if (teacher.user_role !== "TEACHER") {
        return new Response(
            JSON.stringify({
            message: `User with ID ${teacher_id} is not a TEACHER`,
            }),
            { status: 403 }
        );
    }

    // Check if the student exists
    let existingStudent = await prisma.student.findUnique({
      where: { student_id },
    });

    // If the student doesn't exist, create it
    if (!existingStudent) {
      existingStudent = await prisma.student.create({
        data: {
          student_id,
          student_name,
          faculty,
        },
      });
    }

    // // Check if the student is already in the course
    // const existingCourseStudent = await prisma.course_student.findFirst({
    //   where: {
    //     course_id,
    //     student_id,
    //   },
    // });

    // if (existingCourseStudent) {
    //   return new Response(
    //     JSON.stringify({
    //       error: "Student is already enrolled in this course.",
    //     }),
    //     { status: 400 }
    //   );
    // }

    // // Add the student to the course
    // const addToCourseStudent = await prisma.course_student.create({
    //   data: {
    //     course_id,
    //     student_id: existingStudent.student_id,
    //   },
    // });

    return new Response(
      JSON.stringify({ student: existingStudent }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500 }
    );
  }
}
