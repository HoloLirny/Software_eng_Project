/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_course" ALTER COLUMN "section_lab" DROP NOT NULL,
ALTER COLUMN "section_lec" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "password";
