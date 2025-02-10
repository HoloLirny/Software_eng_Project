const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  const now = new Date();
  const dateOnly = now.toISOString().split("T")[0];
  const thailandTime = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Bangkok', hour12: false });

  // ✅ 1. Seed Users
  const user1 = await prisma.user.upsert({
    where: { email: "teacher@example.com" },
    update: {},
    create: {
      email: "teacher@example.com",
      password: "12345678",
      user_role: "TEACHER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "ta@example.com" },
    update: {},
    create: {
      email: "ta@example.com",
      password: "12345678",
      user_role: "TA",
    },
  });

  // ✅ 2. Seed Courses
  const course1 = await prisma.course.upsert({
    where: { course_id: "001001" },
    update: {},
    create: {
      course_name: "eng1",
      scan_time: 60,
      teacher_id: user1.id,
      course_id: "001001",
    },
  });

  // ✅ 3. Seed Students
  const student1 = await prisma.student.upsert({
    where: { student_id: "650610759" },
    update: {},
    create: {
      student_id: "650610759",
      student_name: "earn",
      student_email: "earn@example.com",
      password: "12345678",
    },
  });

  // ✅ 4. Seed Attendance
  await prisma.attendance.create({
    data: {
      student_id: "650610759",
      course_id: "001001",
      section: "001",
      user_id: user1.id,
      date: dateOnly,
      time: thailandTime,
    },
  });

  await prisma.user_course.upsert({
    where: {
      id: 1,
    },
    update: {}, 
    create: {
      user_id: user1.id,
      course_id: "001001",
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
