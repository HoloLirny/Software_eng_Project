import prisma from "../../../../../prisma/prisma";
// Thing left to do
// connect with auth that link id of logined user 

export async function POST(req) {
    try{
        const { course_id, id, faculty, student_name } = await req.json();
        const existingIDStudent = await prisma.student.findUnique({
            where: { id },
        });

        const existingCourse = await prisma.course.findUnique({
            where: { id: course_id },
        });
      
        if (existingIDStudent) {
            return new Response(JSON.stringify({ error: 'student with this ID is already added.' }), { status: 400 });
        }
        if (!existingCourse) {
            return new Response(JSON.stringify({ error: 'Course isnt add yet.' }), { status: 400 });
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
        // Only teacher can add TA
        if (teacher.user_role !== "TEACHER") {
            return new Response(
                JSON.stringify({
                message: `User with ID ${teacher_id} is not a TEACHER`,
                }),
                { status: 403 }
            );
        }

        const newStudent = await prisma.student.create({
            data: {
                id,
                student_name,
                faculty,
            },
          });
      
        const addToCourseStudent = await prisma.course_student.create({
        data: {
            course_id : course_id,
            student_id : newStudent.id,
        },
        });

        return new Response(
            JSON.stringify({ newStudent, addToCourseStudent }),
            { status: 201 }
        );

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal server error.' }), { status: 500 });
    }
}
