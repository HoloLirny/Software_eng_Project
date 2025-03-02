import prisma from "../../../../../prisma/prisma";
// http://localhost:3000/api/attendance-api/edit_date

export async function PUT(req) {
  try {
    const { date_old, date_new, description_new, course_id } = await req.json();

    if (!date_old || !course_id) {
      return new Response(
        JSON.stringify({ message: "date_old and course_id are required" }),
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

    const existingAttendance = await prisma.attendance_detail.findFirst({
      where: { date: date_old, course_id },
    });

    if (!existingAttendance) {
      return new Response(
        JSON.stringify({ error: "Attendance record not found" }),
        { status: 404 }
      );
    }

    const updateData = {
      date: date_new !== undefined ? date_new : existingAttendance.date,
      description: description_new !== undefined ? description_new : existingAttendance.description,
    };

    const updatedAttendance = await prisma.attendance_detail.update({
      where: { id: existingAttendance.id },
      data: updateData,
    });

    return new Response(
      JSON.stringify({
        message: "Attendance record updated successfully",
        attendance_detail: updatedAttendance,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
