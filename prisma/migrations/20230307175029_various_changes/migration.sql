-- DropForeignKey
ALTER TABLE `Embed` DROP FOREIGN KEY `Embed_messageId_fkey`;

-- AlterTable
ALTER TABLE `Message` MODIFY `modulo` INTEGER NOT NULL DEFAULT 7;

-- AddForeignKey
ALTER TABLE `Embed` ADD CONSTRAINT `Embed_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `Message`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
