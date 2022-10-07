/*
  Warnings:

  - You are about to drop the column `scheduled_at` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Embed" ADD COLUMN     "sended" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "scheduled_at",
ADD COLUMN     "hour" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "minute" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "repetitions" INTEGER NOT NULL DEFAULT 7;
