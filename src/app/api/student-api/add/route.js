import prisma from "../../../../../prisma/prisma";

export async function POST(req) {
  try {
    const { student_id, student_name, student_email, course_id, section_lec, section_lab } = await req.json();
    
    // Mock teacher_id for now (replace with actual session logic later)
    const teacher_id = 1; 

    const teacher = await prisma.user.findUnique({
      where: { id: teacher_id },
      select: { user_role: true },
    });

    if (!teacher || teacher.user_role !== "TEACHER") {
      return new Response(
        JSON.stringify({ message: `Unauthorized: User ${teacher_id} is not a TEACHER.` }),
        { status: teacher ? 403 : 404 }
      );
    }

    // Check if student exists
    let existingStudent = await prisma.student.findUnique({
      where: { student_id },
    });

    if (!existingStudent) {
      existingStudent = await prisma.student.create({
        data: {
          student_id,
          student_name,
          student_email,
          section_lec,
          section_lab,
        },
      });
    }

    // Check if student is already enrolled in the course
    const existingEnrollment = await prisma.student_course.findUnique({
      where: {
        student_id_course_id: { student_id, course_id },
      },
    });

    if (existingEnrollment) {
      return new Response(
        JSON.stringify({ error: "Student is already enrolled in this course." }),
        { status: 400 }
      );
    }

    // Enroll student in course
    const studentCourse = await prisma.student_course.create({
      data: {
        student_id,
        course_id,
      },
    });

    return new Response(
      JSON.stringify({ student: existingStudent, enrollment: studentCourse }),
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
