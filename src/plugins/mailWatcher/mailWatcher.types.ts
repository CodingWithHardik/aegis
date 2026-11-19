export interface WatcherAccount {
    email: string;
    refreshToken: string;
    accessToken: string | null;
    expiresAt: Date | null;
    historyId: string | null;
    disconnected: boolean;
}

export interface StoreMessageReferences {
    id: string;
    ticketId: string;
    emailMessageId: string | null;
}

export interface TicketRef {
    id: string;
    customerEmail: string;
}

export interface replyInfo {
    messageId: string;
    ticketDbId: string;
    senderEmail: string;
    text: string;
}

export interface NewMessage {
    ticketDbId: string;
    parentMessageId: string | null;
    senderEmail: string;
    text: string;
    emailMessageId: string;
}

export interface AccountDetails {
    email: string;
    refreshToken: string;
    accessToken: string | null;
    expiresAt: Date | null;
    historyId: string | null;
    disconnected: boolean;
}