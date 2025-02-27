const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  const now = new Date();
  const dateOnly = now.toISOString().split("T")[0];
  const thailandTime = now.toLocaleTimeString("en-US", {
    timeZone: "Asia/Bangkok",
    hour12: false,
  });

  // Seed Users
  const user1 = await prisma.user.upsert({
    where: { email: "teacher@example.com" },
    update: {},
    create: {
      email: "teacher@example.com",
      password: "12345678",
      user_role: "TEACHER",
    },
  });

  // Seed admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: "12345678",
      user_role: "ADMIN",
    },
  });

  // Seed TA
  const user2 = await prisma.user.upsert({
    where: { email: "ta@example.com" },
    update: {},
    create: {
      email: "ta@example.com",
      password: "12345678",
      user_role: "TA",
    },
  });

  // Seed Courses
  const course1 = await prisma.course.upsert({
    where: { course_id: "261361" },
    update: {},
    create: {
      course_name: "Network",
      scan_time: 5,
      teacher_id: user1.id,
      course_id: "261361",
    },
  });

  // // Seed Students
  // const student1 = await prisma.student.upsert({
  //   where: { student_id: "650610759" },
  //   update: {},
  //   create: {
  //     student_id: "650610759",
  //     student_name: "earn",
  //     student_email: "earn@example.com",
  //     section_lec: "001",
  //     section_lab: "000",
  //   },
  // });

  // // Seed Student-Course Relationship
  // await prisma.student_course.create({
  //   data:{
  //     student_id: "650610759", 
  //     course_id: "261361"
  //   }
  // })

  // await prisma.attendance_detail.create({
  //   data:{
  //     date: dateOnly,
  //     description: "HW1",
  //   }
  // })

  // // Seed Attendance
  // await prisma.attendance.create({
  //   data: {
  //     section_lec: "001",
  //     section_lab: "000",
  //     user: {
  //       connect: { id: user1.id },
  //     },
  //     course: {
  //       connect: { course_id: "261361" },
  //     },
  //     student: {
  //       connect: { student_id: "650610759" },
  //     },
  //     attendance_detail: {
  //       connect: { id: 1 },
  //     },
  //   },
  // });

  
  await prisma.user_course.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      user_id: user1.id,
      course_id: "261361",
    },
  });

  await prisma.user_course.upsert({
    where: {
      id: 2,
    },
    update: {},
    create: {
      user_id: user2.id,
      course_id: "261361",
    },
  });

  console.log("Seeding completed!");
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
