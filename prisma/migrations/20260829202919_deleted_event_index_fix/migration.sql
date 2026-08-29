/*
  Warnings:

  - A unique constraint covering the columns `[year,type,deletedTime]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Event_year_type_key";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "deletedReason" TEXT,
ADD COLUMN     "deletedTime" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Event_year_type_deletedTime_key" ON "Event"("year", "type", "deletedTime");
