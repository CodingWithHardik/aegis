/*
  Warnings:

  - A unique constraint covering the columns `[emailMessageId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_emailMessageId_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "parentReplyId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Message_emailMessageId_key" ON "Message"("emailMessageId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_parentReplyId_fkey" FOREIGN KEY ("parentReplyId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
