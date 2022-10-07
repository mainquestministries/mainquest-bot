/*
  Warnings:

  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Embed" DROP CONSTRAINT "Embed_messageId_fkey";

-- AlterTable
ALTER TABLE "Embed" ALTER COLUMN "messageId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
DROP COLUMN "user_id",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Message_id_seq";

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
