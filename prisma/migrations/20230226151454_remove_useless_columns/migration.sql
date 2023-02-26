/*
  Warnings:

  - You are about to drop the column `hour` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `minute` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Message` DROP COLUMN `hour`,
    DROP COLUMN `minute`;
