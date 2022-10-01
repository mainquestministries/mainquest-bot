/*
  Warnings:

  - You are about to drop the `entry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usermessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "entry" DROP CONSTRAINT "entry_usermessageId_fkey";

-- DropTable
DROP TABLE "entry";

-- DropTable
DROP TABLE "usermessage";

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "message_content" JSONB NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "guild" TEXT,
    "user_id" TEXT,
    "channel" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Embed" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "author_avatar_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Embed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
