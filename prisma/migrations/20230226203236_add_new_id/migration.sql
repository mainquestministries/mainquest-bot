/*
  Warnings:

  - Added the required column `new_id` to the `Swallowed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Swallowed` ADD COLUMN `new_id` VARCHAR(191) NOT NULL;
