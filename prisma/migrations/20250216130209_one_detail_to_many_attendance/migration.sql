/*
  Warnings:

  - You are about to drop the column `attendance_id` on the `attendance_detail` table. All the data in the column will be lost.
  - Added the required column `detail_id` to the `attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attendance_detail" DROP CONSTRAINT "attendance_detail_attendance_id_fkey";

-- AlterTable
ALTER TABLE "attendance" ADD COLUMN     "detail_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "attendance_detail" DROP COLUMN "attendance_id";

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_detail_id_fkey" FOREIGN KEY ("detail_id") REFERENCES "attendance_detail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
