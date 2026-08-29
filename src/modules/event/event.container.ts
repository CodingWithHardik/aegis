import { EventRepository } from "./event.repository";
import { EventService } from "./event.service";

const eventRepository = new EventRepository();
const eventService = new EventService(eventRepository);

export { eventService };