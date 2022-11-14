-- CreateTable
CREATE TABLE "guildconfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "p_channel" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message_content" TEXT NOT NULL,
    "hour" INTEGER NOT NULL DEFAULT 7,
    "minute" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 7,
    "modulo" INTEGER NOT NULL DEFAULT 7,
    "disabled" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Embed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "messageId" TEXT,
    "original_message_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "author_avatar_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "color" INTEGER,
    "sended" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Embed_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
