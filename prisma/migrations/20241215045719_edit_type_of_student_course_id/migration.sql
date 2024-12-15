/*
  Warnings:

  - The primary key for the `course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_course_id_fkey";

-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_student_id_fkey";

-- DropForeignKey
ALTER TABLE "course_student" DROP CONSTRAINT "course_student_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_student" DROP CONSTRAINT "course_student_student_id_fkey";

-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_course_id_fkey";

-- DropForeignKey
ALTER TABLE "user_course" DROP CONSTRAINT "user_course_course_id_fkey";

-- AlterTable
ALTER TABLE "attendance" ALTER COLUMN "student_id" SET DATA TYPE TEXT,
ALTER COLUMN "course_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "course" DROP CONSTRAINT "course_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "teacher_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "course_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "course_student" ALTER COLUMN "course_id" SET DATA TYPE TEXT,
ALTER COLUMN "student_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "file" ALTER COLUMN "course_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "student" DROP CONSTRAINT "student_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "student_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_course" ALTER COLUMN "course_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_student" ADD CONSTRAINT "course_student_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_student" ADD CONSTRAINT "course_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
