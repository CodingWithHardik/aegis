/*
  Warnings:

  - Added the required column `familyId` to the `refreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refreshToken" ADD COLUMN     "familyId" TEXT NOT NULL;
