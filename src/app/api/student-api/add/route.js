import prisma from "../../../../../prisma/prisma";

export async function POST(req) {
  try {
    const { student_id, faculty, student_name } = await req.json();

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
          faculty,
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
