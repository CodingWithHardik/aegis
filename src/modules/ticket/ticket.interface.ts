import { Message, Ticket, TicketConfigOAuthToken, User } from "../../../.prisma/client";
import { CreateTicketInputType } from "./ticket.schema";
import { TicketWithMessage } from "./ticket.types";

export interface ITicketRepository {
    createTicket(data: CreateTicketInputType, ticketId: string, user: User | null): Promise<TicketWithMessage>;
    updateTicketId(id: string, ticketId: string): Promise<Ticket>;
    addTicketMessageId(id: string, messageId: string): Promise<Message>;
    manageTicketConfig(refreshToken: string, accessToken: string, expiryDate: Date, email: string, name?: string): Promise<TicketConfigOAuthToken>;
    getTicketConfig(): Promise<TicketConfigOAuthToken | null>;
    findUserByEmail(email: string): Promise<User | null>;
}