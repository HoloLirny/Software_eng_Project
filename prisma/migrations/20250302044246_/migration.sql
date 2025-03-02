-- CreateEnum
CREATE TYPE "user_user_role" AS ENUM ('ADMIN', 'TEACHER', 'TA', 'STUDENT');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "user_role" "user_user_role" DEFAULT 'TEACHER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_course" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "user_course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "student_name" VARCHAR(255) NOT NULL,
    "student_id" TEXT NOT NULL,
    "student_email" TEXT NOT NULL,
    "section_lec" TEXT,
    "section_lab" TEXT,
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_course" (
    "id" SERIAL NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "student_course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "course_name" VARCHAR(255) NOT NULL,
    "scan_time" INTEGER,
    "teacher_id" INTEGER NOT NULL,
    "course_id" TEXT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" SERIAL NOT NULL,
    "course_id" TEXT NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_url" VARCHAR(255) NOT NULL,
    "uploaded_by" INTEGER NOT NULL,
    "upload_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" SERIAL NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "section_lec" TEXT NOT NULL,
    "section_lab" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "detail_id" INTEGER NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_detail" (
    "id" SERIAL NOT NULL,
    "date" TEXT,
    "course_id" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "attendance_detail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_course_user_id_idx" ON "user_course"("user_id");

-- CreateIndex
CREATE INDEX "user_course_course_id_idx" ON "user_course"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_student_id_key" ON "student"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_student_email_key" ON "student"("student_email");

-- CreateIndex
CREATE UNIQUE INDEX "student_user_id_key" ON "student"("user_id");

-- CreateIndex
CREATE INDEX "student_course_student_id_idx" ON "student_course"("student_id");

-- CreateIndex
CREATE INDEX "student_course_course_id_idx" ON "student_course"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_course_student_id_course_id_key" ON "student_course"("student_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_course_id_key" ON "course"("course_id");

-- CreateIndex
CREATE INDEX "file_course_id_idx" ON "file"("course_id");

-- CreateIndex
CREATE INDEX "file_uploaded_by_idx" ON "file"("uploaded_by");

-- CreateIndex
CREATE INDEX "attendance_course_id_idx" ON "attendance"("course_id");

-- CreateIndex
CREATE INDEX "attendance_student_id_idx" ON "attendance"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_detail_date_key" ON "attendance_detail"("date");

-- AddForeignKey
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_course" ADD CONSTRAINT "student_course_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_course" ADD CONSTRAINT "student_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_detail_id_fkey" FOREIGN KEY ("detail_id") REFERENCES "attendance_detail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_detail" ADD CONSTRAINT "attendance_detail_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;
