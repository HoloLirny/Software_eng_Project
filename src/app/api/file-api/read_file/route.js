import prisma from "../../../../../prisma/prisma";
import fs from "fs";
import path from "path";
import * as xlsx from "xlsx";

export async function POST(req) {
  try {
    const { file_name, user_email } = await req.json();

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

    if (teacher.user_role !== "TEACHER") {
      return new Response(
        JSON.stringify({
          message: `User with email ${user_email} is not a TEACHER`,
        }),
        { status: 403 }
      );
    }

    if (!file_name) {
      return new Response(JSON.stringify({ message: "file_name is required" }), { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public/uploads/", file_name);
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ message: `File ${file_name} not found` }), { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let courseId = null;
    let students = [];

    rawData.forEach((row, index) => {
      if (index === 0) {
        courseId = String(row["__EMPTY_1"] ?? "").trim();
      }
      if (index >= 3) {
        students.push({
          seclec: String(row["__EMPTY"] ?? "").trim(),
          seclab: String(row["__EMPTY_1"] ?? "").trim(),
          student_id: String(row["__EMPTY_2"] ?? "").trim(),
          fullname: String(`${row["__EMPTY_3"] ?? ""} ${row["__EMPTY_4"] ?? ""}`.trim()),
          student_email: String(row["__EMPTY_7"] ?? "").trim(),
        });
      }
    });

    if (!courseId) {
      return new Response(JSON.stringify({ message: "Course ID is missing in the file" }), { status: 400 });
    }

    let existingCourse = await prisma.course.findUnique({
      where: { course_id: courseId },
    });

    if (!existingCourse) {
      existingCourse = await prisma.course.create({
        data: {
          course_id: courseId,
          course_name: `Course ${courseId}`,
          scan_time: 5,
          teacher_id: teacher.id,
        },
      });

      await prisma.user_course.create({
        data: {
          user_id: teacher.id,
          course_id: courseId,
        },
      });
    }

    let addedStudents = [];

    for (const student of students) {
      if (student.student_id && student.fullname) {
        const newStudent = await prisma.student.upsert({
          where: { student_id: student.student_id },
          update: {
            student_name: student.fullname,
            student_email: student.student_email,
          },
          create: {
            student_id: student.student_id,
            student_name: student.fullname,
            student_email: student.student_email,
          },
        });

        await prisma.student_course.upsert({
          where: {
            student_id_course_id: {
              student_id: student.student_id,
              course_id: courseId,
            },
          },
          update: {},
          create: {
            student_id: student.student_id,
            section_lec: student.seclec,
            section_lab: student.seclab,
            course_id: courseId,
          },
        });

        addedStudents.push(newStudent);
      }
    }

    return new Response(
      JSON.stringify({
        message: "Students and course processed successfully",
        course_id: courseId,
        added_students: addedStudents,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing attendance from Excel:", error);
    return new Response(
      JSON.stringify({ message: "An error occurred", error: error.message }),
      { status: 500 }
    );
  }
}
