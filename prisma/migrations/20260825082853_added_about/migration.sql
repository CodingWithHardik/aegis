/*
  Warnings:

  - Added the required column `name` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `about` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "about" TEXT;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "about" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "about" TEXT NOT NULL;
