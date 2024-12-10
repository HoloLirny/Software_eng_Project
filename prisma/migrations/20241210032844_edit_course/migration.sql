

-- CreateTable
CREATE TABLE `student` (
    `id` INTEGER NOT NULL,
    `faculty` VARCHAR(255) NOT NULL,
    `student_name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course` (
    `id` INTEGER NOT NULL,
    `course_name` VARCHAR(255) NOT NULL,
    `teacher_id` INTEGER NOT NULL,
    `total_student` INTEGER NOT NULL,
    `scan_time` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
