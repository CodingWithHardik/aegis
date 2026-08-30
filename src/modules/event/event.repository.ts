import { Event, Team } from "../../../.prisma/client";
import { prisma } from "../../lib/prisma";
import { cachedQuery, invalidate } from "../../utils/common/helpers/CacheQuery";
import { measureQuery } from "../../utils/common/helpers/MeasureQuery";
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import { IEventRepository } from "./event.interface";
import { CreateEventInputType, DeleteEventInputType, UpdateEventInputType } from "./event.schema";

export class EventRepository implements IEventRepository {
    async createEvent(data: CreateEventInputType): Promise<Event> {
        await invalidate(cacheKeys.eventByYearAndType(new Date().getFullYear(), data.type));
        return measureQuery("createEvent", () =>
            prisma.event.create({
                data: {
                    ...data,
                    year: new Date().getFullYear()
                }
            })
        )
    }

    async findEventByYearAndType(year: number, type: "INTRA" | "MAIN"): Promise<Event | null> {
        return cachedQuery(
            "findEventByYearAndType",
            {
                key: cacheKeys.eventByYearAndType(year, type),
                ttl: 600
            },
            () =>
                prisma.event.findUnique({
                    where: {
                        year_type_deletedTime: {
                            year,
                            type,
                            deletedTime: ""
                        },
                        isDeleted: false,
                    }
                })
        )
    }

    async findEventById(eventId: string): Promise<Event | null> {
        return cachedQuery(
            "findEventById", 
            {
                key: cacheKeys.event(eventId),
                ttl: 600,
            },
            () => 
                prisma.event.findUnique({
                    where: {
                        id: eventId,
                        isDeleted: false,
                    }
                })
        )
    }

    async teamByUserIdAndEventId(userId: string, eventId: string): Promise<Team | null> {
        return cachedQuery(
            "teamByUserIdAndEventId",
            {
                key: cacheKeys.teamByUserIdAndEventId(userId, eventId),
                ttl: 600
            },
            () => 
                prisma.team.findUnique({
                    where: {
                        eventId_userId: {
                            eventId,
                            userId,
                        }
                    }
                })
        )
    }

    async updateEventById(eventId: string, data: Partial<UpdateEventInputType>): Promise<Event> {
        const { eventId: _, ...updatedData } = data;
        await invalidate(cacheKeys.event(eventId));
        const query = await measureQuery("updateEventById", () =>
            prisma.event.update({
                where: {
                    id: eventId
                },
                data: updatedData,
            }) 
        )
        await invalidate(cacheKeys.eventByYearAndType(query.year, query.type));
        return query;
    }

    async deleteEventById(userId: string, data: DeleteEventInputType): Promise<Event> {
        await invalidate(cacheKeys.event(data.eventId));
        const query = await measureQuery("deleteEventById", () => 
            prisma.event.update({
                where: {
                    id: data.eventId,
                },
                data: {
                    isDeleted: true,
                    deletedReason: data.reason,
                    deletedBy: userId,
                    deletedTime: new Date().toISOString(),
                }
            })
        )
        await invalidate(cacheKeys.eventByYearAndType(query.year, query.type));
        return query;
    }
}