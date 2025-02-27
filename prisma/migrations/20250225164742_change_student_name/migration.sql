/*
  Warnings:

  - You are about to drop the column `student_name` on the `student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstname_TH` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname_TH` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student" DROP COLUMN "student_name",
ADD COLUMN     "firstname_TH" VARCHAR(255) NOT NULL,
ADD COLUMN     "lastname_TH" VARCHAR(255) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "student_user_id_key" ON "student"("user_id");

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
