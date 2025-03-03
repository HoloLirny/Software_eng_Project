import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("course_id");
    const teacher_id = 1;

    if (!courseId) {
      return NextResponse.json(
        { message: "course_id is required" },
        { status: 400 }
      );
    }

    const existingCourse = await prisma.course.findUnique({
      where: { course_id: courseId },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { message: `Course with course_id ${courseId} doesn't exist` },
        { status: 404 }
      );
    }

    const students = await prisma.student_course.findMany({
      where: { course_id: courseId },
      include: {
        student: true,
      },
    });

    const attendances = await prisma.attendance.findMany({
      where: { course_id: courseId },
      include: {
        student: true,
        attendance_detail: true,
      },
    });

    const attendance_details = await prisma.attendance_detail.findMany({
      where: { course_id: courseId },
    });

    const attendanceDates = new Set();
    const dateDescriptions = {};

    attendance_details.forEach((attendance) => {
      const date = attendance.date;
      const description = attendance.description || "";
      dateDescriptions[date] = description ? `${date} - ${description}` : date;
      attendanceDates.add(date);
    });

    const datesArray = Array.from(attendanceDates)
      .sort()
      .map((date) => dateDescriptions[date]); 

    const data = students.map(({ student }) => {
      const row = {
        รหัสนักศึกษา: student.student_id,
        ชื่อ_นามสกุล: student.student_name,
        อีเมล: student.student_email,
      };

      datesArray.forEach((dateDesc) => {
        const [date] = dateDesc.split(" - "); 

        const attendanceForDate = attendances.find(
          (a) =>
            a.student_id === student.student_id &&
            a.attendance_detail?.date === date
        );

        row[dateDesc] = attendanceForDate ? "1" : "0";
      });

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const range = XLSX.utils.decode_range(ws["!ref"]);

    for (let C = range.s.c; C <= range.e.c; ++C) {
      let max_width = 0;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell?.v) {
          max_width = Math.max(max_width, cell.v.toString().length);
        }
      }
      ws["!cols"] = ws["!cols"] || [];
      ws["!cols"][C] = { wch: max_width + 2 };
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Data");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `attendance_data_${courseId}.xlsx`;
    const filePath = path.join(uploadDir, fileName);

    await fs.promises.writeFile(filePath, excelBuffer);

    const existingFile = await prisma.file.findFirst({
      where: {
        file_name: fileName,
        course_id: courseId,
      },
    });

    if (existingFile) {
      const updatedFile = await prisma.file.update({
        where: { id: existingFile.id },
        data: {
          file_url: `/public/uploads/${fileName}`,
          uploaded_by: teacher_id,
        },
      });
      console.log("File updated:", updatedFile);
    } else {
      const savedFile = await prisma.file.create({
        data: {
          file_name: fileName,
          file_url: `/public/uploads/${fileName}`,
          course_id: courseId,
          uploaded_by: teacher_id,
        },
      });
      console.log("File uploaded successfully:", savedFile);
    }

    return NextResponse.json({
      message: "File saved successfully",
      fileUrl: `/public/uploads/${fileName}`,
    });
  } catch (error) {
    console.error("Error exporting attendance data", error);
    return new Response("Error exporting attendance data", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
