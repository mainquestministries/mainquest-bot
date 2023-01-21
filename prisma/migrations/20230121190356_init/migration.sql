/*
  Warnings:

  - Added the required column `source` to the `Embed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Embed` ADD COLUMN `source` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Message` MODIFY `message_content` VARCHAR(191) NOT NULL DEFAULT 'Dein Abo für heute';

-- AlterTable
ALTER TABLE `guildconfig` ADD COLUMN `l_channel` VARCHAR(191) NULL,
    MODIFY `p_channel` VARCHAR(191) NULL;
