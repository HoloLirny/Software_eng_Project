/*
  Warnings:

  - Added the required column `section` to the `attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attendance" ADD COLUMN     "section" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "course" ADD COLUMN     "section" TEXT NOT NULL;
