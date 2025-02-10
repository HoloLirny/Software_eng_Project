/*
  Warnings:

  - You are about to drop the column `total_student` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `user` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attendance" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "course" DROP COLUMN "total_student";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "user_name";

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
