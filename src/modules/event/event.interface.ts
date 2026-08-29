import { Event, Team } from "../../../.prisma/client";
import { CreateEventInputType } from "./event.schema";

export interface IEventRepository {
    createEvent(data: CreateEventInputType): Promise<Event>;

    findEventByYearAndType(year: number, type: "INTRA" | "MAIN"): Promise<Event | null>;

    findEventById(eventId: string): Promise<Event | null>;

    teamByUserIdAndEventId(userId: string, eventId: string): Promise<Team | null>;

    updateEventById(eventId: string, data: Partial<CreateEventInputType>): Promise<Event>;
}