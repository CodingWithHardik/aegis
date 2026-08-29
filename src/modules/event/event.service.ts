import { logger } from "../../config/logger";
import { AppError } from "../../utils/common/Errors/AppError";
import { IEventRepository } from "./event.interface";
import { toEventResponse } from "./event.response";
import { CreateEventInputType } from "./event.schema";

export class EventService {
    constructor(private eventRepo: IEventRepository) {}

    async createEventService(data: CreateEventInputType, userId: string) {
        const existingEvent = await this.eventRepo.findEventByYearAndType(
            new Date().getFullYear(), 
            data.type
        );

        if (existingEvent) {
            throw new AppError(`Event of type ${data.type} already exists for the current year`, 400);
        }

        const event = await this.eventRepo.createEvent({
            ...data,
        });

        logger.info({
            event: "EVENT_CREATED",
            userId: userId,
            eventId: event.id,
        })

        return toEventResponse(event)
    }
}