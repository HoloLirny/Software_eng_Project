/*
  Warnings:

  - You are about to drop the column `section` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `section` on the `file` table. All the data in the column will be lost.
  - Added the required column `section_lab` to the `attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section_lec` to the `attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section_lab` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section_lec` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section_lab` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section_lec` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "section",
ADD COLUMN     "section_lab" TEXT NOT NULL,
ADD COLUMN     "section_lec" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "file" DROP COLUMN "section",
ADD COLUMN     "section_lab" TEXT NOT NULL,
ADD COLUMN     "section_lec" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "section_lab" TEXT NOT NULL,
ADD COLUMN     "section_lec" TEXT NOT NULL;
