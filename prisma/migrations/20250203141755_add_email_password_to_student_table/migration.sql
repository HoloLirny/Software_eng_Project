/*
  Warnings:

  - You are about to drop the column `faculty` on the `student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_email]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_email` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student" DROP COLUMN "faculty",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "student_email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "student_student_email_key" ON "student"("student_email");
