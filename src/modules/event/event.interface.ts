import { Event } from "../../../.prisma/client";
import { CreateEventInputType } from "./event.schema";

export interface IEventRepository {
    createEvent(data: CreateEventInputType): Promise<Event>;

    findEventByYearAndType(year: number, type: "INTRA" | "MAIN"): Promise<Event | null>;
}