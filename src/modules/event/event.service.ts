import { User } from "../../../.prisma/client";
import { logger } from "../../config/logger";
import { AppError } from "../../utils/common/Errors/AppError";
import { IEventRepository } from "./event.interface";
import { toEventResponse } from "./event.response";
import { CreateEventInputType, UpdateEventInputType } from "./event.schema";

export class EventService {
    constructor(private eventRepo: IEventRepository) {}

    async createEventService(data: CreateEventInputType, user: User) {
        const admin = user.isSuperAdmin;
        if (!admin) {
            throw new AppError("Unauthorized", 403);
        }

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
            userId: user.id,
            eventId: event.id,
        })

        return toEventResponse(event)
    }

    async updateEventService(data: UpdateEventInputType, user: User) {
        const admin = user.isSuperAdmin;
        const findTeam = await this.eventRepo.teamByUserIdAndEventId(user.id, data.eventId)

        if (
            !admin && 
            (!findTeam || 
                !["SUPER_ADMIN", "ADMIN"].includes(findTeam.role))
            ) {
            throw new AppError("Unauthorized", 403);
        }

        const event = await this.eventRepo.findEventById(data.eventId);

        if (!event) {
            throw new AppError("Event Not Found", 404);
        }

        const result = await this.eventRepo.updateEventById(
            data.eventId, 
            data
        )

        logger.info({
            event: "EVENT_UPDATED",
            userId: user.id,
            isSuperAdmin: user.isSuperAdmin,
            eventId: result.id,
        })

        return toEventResponse(result)

    }
}