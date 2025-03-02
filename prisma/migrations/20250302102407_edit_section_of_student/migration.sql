/*
  Warnings:

  - You are about to drop the column `section_lab` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `section_lec` on the `student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student" DROP COLUMN "section_lab",
DROP COLUMN "section_lec";

-- AlterTable
ALTER TABLE "student_course" ADD COLUMN     "section_lab" TEXT,
ADD COLUMN     "section_lec" TEXT;
