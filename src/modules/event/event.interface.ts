import { Event, Team } from "../../../.prisma/client";
import { CreateEventInputType, DeleteEventInputType } from "./event.schema";

export interface IEventRepository {
    createEvent(data: CreateEventInputType, userId: string): Promise<Event>;

    findEventByYearAndType(year: number, type: "INTRA" | "MAIN"): Promise<Event | null>;

    findEventById(eventId: string): Promise<Event | null>;

    teamByUserIdAndEventId(userId: string, eventId: string): Promise<Team | null>;

    updateEventById(userId: string, eventId: string, data: Partial<CreateEventInputType>): Promise<Event>;

    deleteEventById(userId: string, data: DeleteEventInputType): Promise<Event>;

    getEventByUser(userId: string): Promise<Event[]>;

    getEventByAdmin(userId: string): Promise<Event[]>;

    getAllEvents(): Promise<Event[]>;
}