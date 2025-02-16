/*
  Warnings:

  - You are about to drop the column `date` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "date",
DROP COLUMN "time";

-- CreateTable
CREATE TABLE "attendance_detail" (
    "id" SERIAL NOT NULL,
    "date" TEXT,
    "time" TEXT,
    "description" TEXT,
    "attendance_id" INTEGER NOT NULL,

    CONSTRAINT "attendance_detail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "attendance_detail" ADD CONSTRAINT "attendance_detail_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
