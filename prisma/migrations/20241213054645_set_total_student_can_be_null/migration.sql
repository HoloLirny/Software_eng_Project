-- AlterTable
ALTER TABLE "attendance" ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "time" DROP NOT NULL;

-- AlterTable
ALTER TABLE "course" ALTER COLUMN "total_student" DROP NOT NULL;
