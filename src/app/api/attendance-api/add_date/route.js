import prisma from "../../../../../prisma/prisma";
// http://localhost:3000/api/attendance-api/add_date
export async function POST(req) {
  try {
    const { description, date, course_id } = await req.json();

    if (!date || !course_id) {
      return new Response(
        JSON.stringify({ message: "date and course_id are required" }),
        { status: 400 }
      );
    }

    const existingCourse = await prisma.course.findUnique({
      where: { course_id },
    });

    if (!existingCourse) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
      });
    }

    const existingDate = await prisma.attendance_detail.findFirst({
      where: {
        date,
        course_id,
      },
    });

    if (existingDate) {
      return new Response(
        JSON.stringify({
          message: `${date} is already assigned in course ${course_id}`,
        }),
        { status: 400 }
      );
    }

    const addDate = await prisma.attendance_detail.create({
      data: {
        date,
        description,
        course_id,
      },
    });

    return new Response(
      JSON.stringify({
        message: `${date} has been added.`,
        attendance_detail: addDate,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
