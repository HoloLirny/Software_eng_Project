-- CreateTable
CREATE TABLE "student_course" (
    "id" SERIAL NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "student_course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "student_course_student_id_idx" ON "student_course"("student_id");

-- CreateIndex
CREATE INDEX "student_course_course_id_idx" ON "student_course"("course_id");

-- AddForeignKey
ALTER TABLE "student_course" ADD CONSTRAINT "student_course_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_course" ADD CONSTRAINT "student_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;
