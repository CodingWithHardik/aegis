/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Committee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Committee" ADD COLUMN     "about" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Committee_slug_key" ON "Committee"("slug");
