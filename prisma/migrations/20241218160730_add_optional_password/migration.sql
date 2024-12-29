-- AlterTable
ALTER TABLE "user" ADD COLUMN     "image" TEXT,
ALTER COLUMN "user_name" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
