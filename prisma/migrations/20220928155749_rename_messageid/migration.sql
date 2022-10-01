/*
  Warnings:

  - You are about to drop the column `MessageID` on the `entry` table. All the data in the column will be lost.
  - Added the required column `Message_id` to the `entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "entry" DROP COLUMN "MessageID",
ADD COLUMN     "Message_id" TEXT NOT NULL;
