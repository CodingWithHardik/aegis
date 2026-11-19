import { AccountDetails, NewMessage, StoreMessageReferences, TicketRef } from "./mailWatcher.types";

export interface IMailWatcherRepository {
    getAccount(): Promise<AccountDetails | null>;
    saveTokens(
        refreshToken: string,
        t: {
            accessToken?: string;
            expiresAt?: Date;
            refreshToken?: string
        }
    ): Promise<void>;
    saveHistoryId(refreshToken: string, historyId: string): Promise<void>
    markDisconnected(refreshToken: string): Promise<void>;
    findMessageByEmailIds(localParts: string[]): Promise<StoreMessageReferences[]>;
    findTicketByTCEId(ticketId: string): Promise<TicketRef | null>;
    findLastMessageId(ticketDbId: string): Promise<string | null>;
    saveMessage(message: NewMessage): Promise<{ id: string } | null>;
}