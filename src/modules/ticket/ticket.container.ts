import { TicketRepository } from "./ticket.repository";
import { TicketService } from "./ticket.service";

const ticketRepository = new TicketRepository();
const ticketService = new TicketService(ticketRepository);

export { ticketService };