import prisma from "../../../../../prisma/prisma";

// http://localhost:3000/api/attendance-api/add
export async function POST(req) {
  try {
    const { course_id, student_id } = await req.json();

    // Validate input
    if (!course_id || !student_id) {
      return new Response(
        JSON.stringify({
          message: "Both course_id and student_id are required",
        }),
        { status: 400 }
      );
    }

    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { course_id: course_id }, // Use course_id as per your schema
    });

    if (!course) {
      return new Response(
        JSON.stringify({
          message: "Course with id " + course_id + " not found",
        }),
        { status: 404 }
      );
    }

    // Check if the student exists
    const student = await prisma.student.findUnique({
      where: { student_id: student_id }, // Use student_id as per your schema
    });

    if (!student) {
      return new Response(
        JSON.stringify({
          message: "Student with id " + student_id + " didn't sign up",
        }),
        { status: 404 }
      );
    }

    // Create an attendance record
    const attendance = await prisma.attendance.create({
      data: {
        course_id: course_id,
        student_id: student_id,
        date: new Date(), 
        time: new Date(), 
      },
    });

    return new Response(
      JSON.stringify({
        message: "Student with id " + student_id + " has been added to course with id " + course_id,
        attendance: attendance,
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