/*
  Warnings:

  - You are about to drop the column `status` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "status",
ALTER COLUMN "message_content" SET DATA TYPE TEXT;
