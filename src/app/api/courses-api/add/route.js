import prisma from "../../../../../prisma/prisma";

export async function POST(req) {
  // Thing left to do
  // = teacher_id = id of login user who has user_role == "TEACHER" from log in session
  // = Throw error
  try {
    const { id, course_name, teacher_id, total_student, scan_time } = await req.json();

    if (!id || !course_name === undefined) {
      return new Response(
        JSON.stringify({
          message: "Course ID, course name are required",
        }),
        { status: 400 }
      );
    }

    // Create a new course record in the database
    const newCourse = await prisma.course.create({
      data: {
        id,
        course_name,
        teacher_id, 
        total_student,
        scan_time,
      },
    });

    return new Response(JSON.stringify(newCourse), { status: 201 });
  } catch (error) {
    console.error("Error adding course:", error);
    return new Response(
      JSON.stringify({ message: "An error occurred while adding the course", error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
