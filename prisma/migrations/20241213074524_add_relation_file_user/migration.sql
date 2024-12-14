/*
  Warnings:

  - Added the required column `uploaded_by` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN     "uploaded_by" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "file_course_id_idx" ON "file"("course_id");

-- CreateIndex
CREATE INDEX "file_uploaded_by_idx" ON "file"("uploaded_by");

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
