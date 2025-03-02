/*
  Warnings:

  - You are about to drop the column `firstname_TH` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `lastname_TH` on the `student` table. All the data in the column will be lost.
  - Added the required column `student_name` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student" DROP COLUMN "firstname_TH",
DROP COLUMN "lastname_TH",
ADD COLUMN     "student_name" VARCHAR(255) NOT NULL;
