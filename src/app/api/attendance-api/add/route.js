import prisma from "../../../../../prisma/prisma";

// http://localhost:3000/api/attendance-api/add
export async function POST(req) {
  try {
    const { course_id, student_id, date } = await req.json();

    // Validate input
    if (!course_id || !student_id || !date) {
      return new Response(
        JSON.stringify({
          message: "course_id, student_id, and date are required",
        }),
        { status: 400 }
      );
    }

    ///////////////////////////////////////////////////////
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
    ///////////////////////////////////////////////////////

    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { course_id },
    });

    if (!course) {
      return new Response(
        JSON.stringify({
          message: `Course with ID ${course_id} not found`,
        }),
        { status: 404 }
      );
    }

    // Check if the student exists
    const student = await prisma.student.findUnique({
      where: { student_id },
    });

    if (!student) {
      return new Response(
        JSON.stringify({
          message: `Student with ID ${student_id} didn't sign up`,
        }),
        { status: 404 }
      );
    }

    const { section_lab, section_lec } = student;

    // Check if the date exists in attendance_detail
    const existingDate = await prisma.attendance_detail.findFirst({
      where: { date },
    });

    if (!existingDate) {
      return new Response(
        JSON.stringify({
          message: `${date} must be added first in attendance_detail`,
        }),
        { status: 404 }
      );
    }

    // Check if the student is already checked in for this course on the same day
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        course_id,
        student_id,
        detail_id: existingDate.id,
      },
    });

    if (existingAttendance) {
      return new Response(
        JSON.stringify({
          message: `Student with ID ${student_id} has already checked in for course ${course_id} on ${date}`,
        }),
        { status: 409 }
      );
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        course_id,
        section_lab,
        section_lec,
        student_id,
        user_id: teacher_id,
        detail_id: existingDate.id,
      },
      include: {
        attendance_detail: true, // Include attendance_detail in response
      },
    });

    return new Response(
      JSON.stringify({
        message: `Student with ID ${student_id} has been added to course ${course_id}`,
        attendance,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding student to course:", error);
    return new Response(
      JSON.stringify({
        message: "An error occurred while adding the student to the course",
        error: error.message || "Internal Server Error",
      }),
      { status: 500 }
    );
  }
}
