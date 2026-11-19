-- AlterTable
ALTER TABLE "TicketConfigOAuthToken" ADD COLUMN     "disconnected_at" TIMESTAMP(3),
ADD COLUMN     "history_id" TEXT;
