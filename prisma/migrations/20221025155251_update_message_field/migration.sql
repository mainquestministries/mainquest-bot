/*
  Warnings:

  - You are about to drop the column `channel` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `guild` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `userconfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "channel",
DROP COLUMN "guild",
ADD COLUMN     "modulo" INTEGER NOT NULL DEFAULT 7;

-- DropTable
DROP TABLE "userconfig";
