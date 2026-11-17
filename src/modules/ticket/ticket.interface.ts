import { Message, Ticket, TicketConfigOAuthToken, User } from "../../../.prisma/client";
import { CreateTicketInputType } from "./ticket.schema";

export interface ITicketRepository {
    manageTicketConfig(refreshToken: string, accessToken: string, expiryDate: Date, email: string, name?: string): Promise<TicketConfigOAuthToken>;
    getTicketConfig(): Promise<TicketConfigOAuthToken | null>;
}