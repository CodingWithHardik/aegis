import { TicketConfigResponseType, TicketMessageResponseType, TicketResponseType, TicketWithMessage } from "./ticket.types";

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

export const toMessageResponse = (message: TicketMessageResponseType) => {
    return {
        id: message.id,
        ticketId: message.ticketId,
        text: message.text,
        createdAt: message.createdAt,
    }
}

export const toGetMessageResponse = (message: TicketMessageResponseType) => {
    return {
        id: message.id,
        direction: message.direction,
        senderEmail: message.senderEmail,
        text: message.text,
        createdAt: message.createdAt,
    }
}

export const toTicketWithMessagesResponse = (ticket: TicketWithMessage) => ({
    ...toTicketResponse(ticket),
    messages: ticket.message.map(toGetMessageResponse)
})

export const toTicketGetResponse = (ticket: TicketResponseType[]) => {
    return ticket.map(( ticket ) => toTicketResponse(ticket))
} 