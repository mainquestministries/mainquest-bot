/*
  Warnings:

  - Added the required column `channel_id` to the `Swallowed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Swallowed` ADD COLUMN `channel_id` VARCHAR(191) NOT NULL;
