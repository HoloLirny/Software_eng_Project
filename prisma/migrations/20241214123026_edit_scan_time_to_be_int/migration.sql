/*
  Warnings:

  - The `scan_time` column on the `course` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "course" DROP COLUMN "scan_time",
ADD COLUMN     "scan_time" INTEGER;
