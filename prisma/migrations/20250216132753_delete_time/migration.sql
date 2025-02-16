/*
  Warnings:

  - You are about to drop the column `time` on the `attendance_detail` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date]` on the table `attendance_detail` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "attendance_detail" DROP COLUMN "time";

-- CreateIndex
CREATE UNIQUE INDEX "attendance_detail_date_key" ON "attendance_detail"("date");
