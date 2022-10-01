/*
  Warnings:

  - Added the required column `original_message_id` to the `Embed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Embed" ADD COLUMN     "original_message_id" TEXT NOT NULL;
