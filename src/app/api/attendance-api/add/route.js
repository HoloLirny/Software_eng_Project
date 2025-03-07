import prisma from "../../../../../prisma/prisma";

// http://localhost:3000/api/attendance-api/add
export async function POST(req) {
  try {
    const { course_id, student_id, date, user_email } = await req.json();
	console.log("test course id ",course_id ,student_id ,date ,user_email )
    // Validate input
    if (!course_id || !student_id || !date || !user_email) {
	
      return new Response(
        JSON.stringify({
          message: "course_id, student_id, user_email and date are required",
        }),
        { status: 400 }
      );
    }

    ///////////////////////////////////////////////////////
    const teacher = await prisma.user.findUnique({
      where: { email: user_email },
    });

    if (!teacher) {
      return new Response(
        JSON.stringify({
          message: `User with email ${user_email} not found`,
        }),
        { status: 404 }
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

    const exist_course_student = await prisma.student_course.findFirst({
      where: {
        course_id: course_id,
        student_id: student_id,
      }
    })

    if (!exist_course_student) {
      return new Response(
        JSON.stringify({
          message: `Student with ID ${student_id} didn't enroll in course ${course_id}`,
        }),
        { status: 404 }
      );
    }

    const { section_lab, section_lec } = exist_course_student;

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
        user_id: teacher.id,
        detail_id: existingDate.id,
      },
      include: {
        attendance_detail: true, 
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
