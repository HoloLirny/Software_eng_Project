import prisma from "../../../../../prisma/prisma";
import fs from "fs";
import path from "path";
import * as xlsx from "xlsx";

// http://localhost:3000/api/file-api/read_file
export async function POST(req) {
  try {
    const { file_name } = await req.json();
    
    if (!file_name) {
      return new Response(
        JSON.stringify({ message: "file_name is required" }),
        { status: 400 }
      );
    }
    
    // ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
    const filePath = path.join(process.cwd(), "public/uploads/", file_name);
    if (!fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({ message: `File ${file_name} not found` }),
        { status: 404 }
      );
    }

    // อ่านไฟล์ Excel
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let courseId = null;
    let students = [];

    rawData.forEach((row, index) => {
      if (index === 0) {
        courseId = String(row["__EMPTY_1"] ?? ""); // 🔹 แปลงเป็น String และป้องกัน null
      }
      if (index >= 3) {
        students.push({
          seclec: String(row["__EMPTY"] ?? ""), 
          seclab: String(row["__EMPTY_1"] ?? ""), 
          student_id: String(row["__EMPTY_2"] ?? ""), 
          fullname: String(`${row["__EMPTY_3"] ?? ""} ${row["__EMPTY_4"] ?? ""}`.trim()),
        });
      }
    });

    if (!courseId) {
      return new Response(
        JSON.stringify({ message: "Course ID is missing in the file" }),
        { status: 400 }
      );
    }

    // 🔹 ตรวจสอบว่าคอร์สมีอยู่หรือไม่ ถ้าไม่มีให้สร้างใหม่
    let existingCourse = await prisma.course.findUnique({
      where: { course_id: courseId },
    });

    let teacherId = 1; // 🔹 ต้องเปลี่ยนเป็นค่าอ้างอิงจริง

    if (!existingCourse) {
      existingCourse = await prisma.course.create({
        data: {
          course_id: courseId,
          course_name: `Course ${courseId}`, // สามารถเปลี่ยนเป็นชื่อจริงได้
          teacher_id: teacherId,
        },
      });

      // 🔹 เพิ่ม `user_course` ให้กับอาจารย์ผู้สอน
      await prisma.user_course.create({
        data: {
          user_id: teacherId,
          course_id: courseId,
        },
      });
    }

    let addedStudents = [];

    for (const student of students) {
      if (student.student_id && student.fullname) {
        // 🔹 ตรวจสอบว่านักศึกษามีอยู่หรือไม่
        const existingStudent = await prisma.student.findUnique({
          where: { student_id: student.student_id },
        });

        if (!existingStudent) {
          // ถ้ายังไม่มีในฐานข้อมูล ให้เพิ่มเข้าไป
          const newStudent = await prisma.student.create({
            data: {
              student_id: student.student_id,
              student_name: student.fullname,
              student_email: `${student.student_id}@example.com`, // เปลี่ยนเป็น email จริง
              password: "defaultpassword", // ควรใช้การเข้ารหัสรหัสผ่าน
              section_lec: student.seclec,
              section_lab: student.seclab,
            },
          });
          addedStudents.push(newStudent);
        }
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
