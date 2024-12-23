/*
  Warnings:

  - The primary key for the `course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `course` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `uploaded_at` on the `file` table. All the data in the column will be lost.
  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `student` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[course_id]` on the table `course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[student_id]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `course_id` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `student` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE "course" DROP CONSTRAINT "course_pkey",
ADD COLUMN     "course_id" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "course_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "file" DROP COLUMN "uploaded_at",
ADD COLUMN     "upload_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "student" DROP CONSTRAINT "student_pkey",
ADD COLUMN     "student_id" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "student_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "course_course_id_key" ON "course"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_student_id_key" ON "student"("student_id");

-- AddForeignKey
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_student" ADD CONSTRAINT "course_student_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_student" ADD CONSTRAINT "course_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;
