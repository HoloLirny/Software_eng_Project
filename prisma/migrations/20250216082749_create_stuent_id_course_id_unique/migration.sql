/*
  Warnings:

  - A unique constraint covering the columns `[student_id,course_id]` on the table `student_course` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "student_course_student_id_course_id_key" ON "student_course"("student_id", "course_id");
