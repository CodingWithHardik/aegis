import { Prisma } from "../../../.prisma/client";
import { MessageDirection, MessageSource, TicketStatus } from "../../../.prisma/enums";

export type TicketConfigResponseType = {
    id: number;
    email: string;
    refreshToken: string;
    accessToken: string | null;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export type TicketResponseType = {
    id: string;
    seq: bigint;
    ticketId: string;
    customerName: string;
    customerEmail: string;
    customerPhoneNo: string;
    userConnected: boolean;
    status: TicketStatus
    createdAt: Date;
    updatedAt: Date;
}

export type TicketMessageResponseType = {
    id: string;
    ticketId: string;
    direction: MessageDirection;
    source: MessageSource;
    isFirst: boolean;
    senderEmail: string;
    text: string
    isDeleted: boolean;
    createdAt: Date;
}

export type TicketWithMessage = Prisma.TicketGetPayload<{
    include: { message: true }
}>;