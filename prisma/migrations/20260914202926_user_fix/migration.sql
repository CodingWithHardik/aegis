/*
  Warnings:

  - Added the required column `class` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentType` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH', 'UPI');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "class" TEXT NOT NULL,
ADD COLUMN     "munAchievements" TEXT,
ADD COLUMN     "munExperience" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentLink" TEXT,
ADD COLUMN     "paymentType" "PaymentType" NOT NULL,
ADD COLUMN     "section" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "instution" TEXT;
