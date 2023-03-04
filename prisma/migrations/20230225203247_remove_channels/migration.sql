/*
  Warnings:

  - You are about to drop the column `l_channel` on the `guildconfig` table. All the data in the column will be lost.
  - You are about to drop the column `w_channel` on the `guildconfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `guildconfig` DROP COLUMN `l_channel`,
    DROP COLUMN `w_channel`;
