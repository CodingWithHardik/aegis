import { Message, Team, Ticket, TicketConfigOAuthToken, User } from "../../../.prisma/client";
import { CreateTicketInputType } from "./ticket.schema";
import { TicketWithMessage } from "./ticket.types";

export interface ITicketRepository {
    createTicket(data: CreateTicketInputType, ticketId: string, user: User | null): Promise<TicketWithMessage>;
    updateTicketId(id: string, ticketId: string): Promise<Ticket>;
    addTicketMessageId(id: string, messageId: string): Promise<Message>;
    manageTicketConfig(refreshToken: string, accessToken: string, expiryDate: Date, email: string, name?: string): Promise<TicketConfigOAuthToken>;
    getTicketConfig(): Promise<TicketConfigOAuthToken | null>;
    findUserByEmail(email: string): Promise<User | null>;
    getActiveYearTeam(userId: string): Promise<Team | null>;
    getTicketById(id: string): Promise<Ticket | null>;
    getMessages(id: string): Promise<Message[]>;
    addMessage(ticketId: string, isStaff: boolean, senderEmail: string, message: string, messageId: string | null, lastMessagedbId: string | null): Promise<Message>;
}