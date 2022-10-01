/*
  Warnings:

  - Added the required column `MessageID` to the `entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "entry" ADD COLUMN     "MessageID" TEXT NOT NULL;
