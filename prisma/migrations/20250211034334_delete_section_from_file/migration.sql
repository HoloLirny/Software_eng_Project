/*
  Warnings:

  - You are about to drop the column `section_lab` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `section_lec` on the `file` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "file" DROP COLUMN "section_lab",
DROP COLUMN "section_lec";
