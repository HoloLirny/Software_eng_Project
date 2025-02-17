/*
  Warnings:

  - You are about to drop the `course_student` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "course_student" DROP CONSTRAINT "course_student_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_student" DROP CONSTRAINT "course_student_student_id_fkey";

-- DropTable
DROP TABLE "course_student";
