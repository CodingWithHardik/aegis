-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('NOT_MARKED', 'MARKED', 'MARKED_UPDATED');

-- AlterTable
ALTER TABLE "Committee" ADD COLUMN     "attendanceStatus" "AttendanceStatus" NOT NULL DEFAULT 'NOT_MARKED';
