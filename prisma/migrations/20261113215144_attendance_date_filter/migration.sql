/*
  Warnings:

  - A unique constraint covering the columns `[memberId,committeeId,date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "date" DATE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_memberId_committeeId_date_key" ON "Attendance"("memberId", "committeeId", "date");
