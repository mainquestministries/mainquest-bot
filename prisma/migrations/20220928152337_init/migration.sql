-- CreateTable
CREATE TABLE "guildconfig" (
    "id" TEXT NOT NULL,
    "p_channel" TEXT NOT NULL,

    CONSTRAINT "guildconfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usermessage" (
    "id" TEXT NOT NULL,
    "user" TEXT,
    "guild" TEXT,
    "channel" TEXT,

    CONSTRAINT "usermessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userentry" (
    "id" SERIAL NOT NULL,
    "usermessageId" TEXT,
    "entryUserentry_id" INTEGER NOT NULL,

    CONSTRAINT "userentry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entry" (
    "userentry_id" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "Content" TEXT NOT NULL,

    CONSTRAINT "entry_pkey" PRIMARY KEY ("userentry_id")
);

-- AddForeignKey
ALTER TABLE "userentry" ADD CONSTRAINT "userentry_entryUserentry_id_fkey" FOREIGN KEY ("entryUserentry_id") REFERENCES "entry"("userentry_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userentry" ADD CONSTRAINT "userentry_usermessageId_fkey" FOREIGN KEY ("usermessageId") REFERENCES "usermessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
