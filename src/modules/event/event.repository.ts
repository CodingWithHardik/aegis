import { Event } from "../../../.prisma/client";
import { prisma } from "../../lib/prisma";
import { cachedQuery } from "../../utils/common/helpers/CacheQuery";
import { measureQuery } from "../../utils/common/helpers/MeasureQuery";
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import { IEventRepository } from "./event.interface";
import { CreateEventInputType } from "./event.schema";

export class EventRepository implements IEventRepository {
    async createEvent(data: CreateEventInputType): Promise<Event> {
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
                        year_type: {
                            year,
                            type,
                        },
                        isDeleted: false,
                    }
                })
        )
    }
}