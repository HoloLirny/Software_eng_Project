/*
  Warnings:

  - You are about to drop the column `status` on the `attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "status";

-- DropEnum
DROP TYPE "attendance_status";
