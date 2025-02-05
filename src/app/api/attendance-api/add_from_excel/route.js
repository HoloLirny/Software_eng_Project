import prisma from "../../../../../prisma/prisma";
import fs from "fs";
import path from "path";
import * as xlsx from "xlsx";

// http://localhost:3000/api/attendance-api/add_from_excel
export async function POST(req) {
  try {
    const { course_id, file_name } = await req.json();
    
    if (!course_id || !file_name) {
      return new Response(
        JSON.stringify({ message: "Both course_id and file_name are required" }),
        { status: 400 }
      );
    }
    
    const filePath = path.join(process.cwd(), "public/uploads/", file_name);
    console.log("File Path:", filePath);
    if (!fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({ message: `File ${file_name} not found` }),
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log("Excel Data:", data);

    const presentStudents = data.filter(row => row.present === 1).map(row => row.student_id);
    
    if (presentStudents.length === 0) {
      return new Response(
        JSON.stringify({ message: "No students marked as present." }),
        { status: 400 }
      );
    }

    const now = new Date();
    const dateOnly = now.toISOString().split("T")[0];
    const thailandTime = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Bangkok', hour12: false });

    for (const student_id of presentStudents) {
      const studentIdString = String(student_id);
      const student = await prisma.student.findUnique({ where: { student_id:studentIdString } });
      if (!student){
        console.log(`Student with ID ${studentIdString} not found`);
        continue;
      } 
      const existingAttendance = await prisma.attendance.findFirst({
        where: { course_id, student_id: studentIdString, date: dateOnly },
      });
      
      if (!existingAttendance) {
        await prisma.attendance.create({
          data: {
            course_id,
            student_id:studentIdString,
            user_id: 1, 
            date: dateOnly,
            time: thailandTime,
          },
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: "Attendance records have been successfully added.",
        presentStudents,
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
