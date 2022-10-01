/*
  Warnings:

  - The primary key for the `entry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userentry_id` on the `entry` table. All the data in the column will be lost.
  - You are about to drop the `userentry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "userentry" DROP CONSTRAINT "userentry_entryUserentry_id_fkey";

-- DropForeignKey
ALTER TABLE "userentry" DROP CONSTRAINT "userentry_usermessageId_fkey";

-- AlterTable
ALTER TABLE "entry" DROP CONSTRAINT "entry_pkey",
DROP COLUMN "userentry_id",
ADD COLUMN     "usermessageId" TEXT,
ADD CONSTRAINT "entry_pkey" PRIMARY KEY ("Message_id");

-- DropTable
DROP TABLE "userentry";

-- AddForeignKey
ALTER TABLE "entry" ADD CONSTRAINT "entry_usermessageId_fkey" FOREIGN KEY ("usermessageId") REFERENCES "usermessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
