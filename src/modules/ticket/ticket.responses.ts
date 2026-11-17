import { TicketConfigResponseType, TicketResponseType } from "./ticket.types";

export const toTicketAdminConfigResponse = (ticketConfig: TicketConfigResponseType) => {
    return {
        id: ticketConfig.id,
        email: ticketConfig.email,
        createdAt: ticketConfig.createdAt,
        updatedAt: ticketConfig.updatedAt,
    }
}

export const toTicketResponse = (ticket: TicketResponseType) => {
    return {
        id: ticket.id,
        ticketId: ticket.ticketId,
        name: ticket.customerName,
        email: ticket.customerEmail,
        phoneNo: ticket.customerPhoneNo,
        userExits: ticket.userConnected,
        status: ticket.status,
        createdAt: ticket.createdAt
    }
}