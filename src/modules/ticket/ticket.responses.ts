import { TicketConfigResponseType } from "./ticket.types";

export const toTicketAdminConfigResponse = (ticketConfig: TicketConfigResponseType) => {
    return {
        id: ticketConfig.id,
        email: ticketConfig.email,
        createdAt: ticketConfig.createdAt,
        updatedAt: ticketConfig.updatedAt,
    }
}