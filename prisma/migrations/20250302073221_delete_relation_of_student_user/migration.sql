/*
  Warnings:

  - You are about to drop the column `user_id` on the `student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_user_id_fkey";

-- DropIndex
DROP INDEX "student_user_id_key";

-- AlterTable
ALTER TABLE "student" DROP COLUMN "user_id";
