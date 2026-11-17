-- CreateTable
CREATE TABLE "TicketConfigOAuthToken" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "refresh_token" TEXT NOT NULL,
    "access_token" TEXT,
    "expires_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketConfigOAuthToken_pkey" PRIMARY KEY ("id")
);
