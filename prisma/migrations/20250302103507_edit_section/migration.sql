/*
  Warnings:

  - Made the column `section_lab` on table `student_course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `section_lec` on table `student_course` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "student_course" ALTER COLUMN "section_lab" SET NOT NULL,
ALTER COLUMN "section_lec" SET NOT NULL;
