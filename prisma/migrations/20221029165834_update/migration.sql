/*
  Warnings:

  - Added the required column `Post_id` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attachment` ADD COLUMN `Post_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `_PostToProfile` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PostToProfile_AB_unique`(`A`, `B`),
    INDEX `_PostToProfile_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_Post_id_fkey` FOREIGN KEY (`Post_id`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostToProfile` ADD CONSTRAINT `_PostToProfile_A_fkey` FOREIGN KEY (`A`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostToProfile` ADD CONSTRAINT `_PostToProfile_B_fkey` FOREIGN KEY (`B`) REFERENCES `Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
