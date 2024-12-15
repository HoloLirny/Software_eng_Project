/*
  Warnings:

  - Changed the type of `teacher_id` on the `course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "course" DROP COLUMN "teacher_id",
ADD COLUMN     "teacher_id" INTEGER NOT NULL;
