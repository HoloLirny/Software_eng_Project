import prisma from "../../../../../prisma/prisma";
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { student_id, student_name, password, student_email } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    // Mock teacher_id for now (replace with actual session logic later)
    const teacher_id = 5; 

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
          password:hashedPassword,
          student_email
        },
      });
    }

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
