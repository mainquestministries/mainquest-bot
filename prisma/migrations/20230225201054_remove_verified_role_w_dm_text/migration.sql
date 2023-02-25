/*
  Warnings:

  - You are about to drop the column `verified_role` on the `guildconfig` table. All the data in the column will be lost.
  - You are about to drop the column `w_dm_text` on the `guildconfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `guildconfig` DROP COLUMN `verified_role`,
    DROP COLUMN `w_dm_text`;
