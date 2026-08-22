-- CreateEnum
CREATE TYPE "RefreshStatus" AS ENUM ('ACTIVE', 'ROTATED', 'REVOKED', 'EXPIRY');

-- AlterTable
ALTER TABLE "refreshToken" ADD COLUMN     "status" "RefreshStatus" NOT NULL DEFAULT 'ACTIVE';
