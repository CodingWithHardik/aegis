import { Committee, Role } from "../../../.prisma/client";
import { prisma } from "../../lib/prisma";
import { cachedQuery, invalidate } from "../../utils/common/helpers/CacheQuery";
import { measureQuery } from "../../utils/common/helpers/MeasureQuery";
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import { ICommitteeRepository } from "./committee.interface";
import { CreateCommitteeInputType, DeleteCommitteeInputType, GetCommitteeInputType, UpdateCommitteeInputType } from "./committee.schema";

export class CommitteeRepository implements ICommitteeRepository {
    async getCommittee(data: GetCommitteeInputType): Promise<Committee[]> {
        return cachedQuery(
            "getCommittee",
            {
                key: cacheKeys.committeeByEventIdAndCommitteeId(data.committeeId, data.eventId),
                ttl: 600,
            },
            () => 
                prisma.committee.findMany({
                    where: {
                        ...(data.eventId && { eventId: data.eventId }),
                        ...(data.committeeId && { id: data.committeeId }),
                    }
                })
        )
    }

    async getEventByCommitteeId(committeeId: string): Promise<Committee | null> {
        return cachedQuery(
            "getCommitteeById",
            {
                key: cacheKeys.committeeId(committeeId),
                ttl: 600,
            },
            () => 
                prisma.committee.findUnique({
                    where: {
                        id: committeeId,
                    }
                })
        )
    }

    async getRoleByEventIdAndUserId(eventId: string, userId: string): Promise<{ role: Role } | null> {
        return cachedQuery(
            "getRoleByEventIdAndUserId",
            {
                key: cacheKeys.teamByEventIdAndUserId(userId, eventId),
                ttl: 600,
            },
            () => 
                prisma.team.findUnique({
                    where: {
                        eventId_userId: {
                            eventId,
                            userId,
                        }
                    },
                    select: {
                        role: true
                    }
                })
        )
    }

    async createCommittee(data: CreateCommitteeInputType): Promise<Committee> {
        const result =  await measureQuery(
            "createCommittee",
            () => 
                prisma.committee.create({
                    data,
                })
        )
        invalidate(cacheKeys.committeeByEventIdAndCommitteeId("*", result.eventId));
        invalidate(cacheKeys.committeeId(result.id));
        return result;
    }

    async updateCommittee(data: UpdateCommitteeInputType): Promise<Committee> {
        const result = await measureQuery(
            "updateCommittee",
            () =>
                prisma.committee.update({
                    where: {
                        id: data.committeeId,
                    },
                    data: {
                        ...(data.name !== undefined && { name: data.name }),
                        ...(data.slug !== undefined && { slug: data.slug }),
                        ...(data.agenda !== undefined && { agenda: data.agenda }),
                        ...(data.about !== undefined && { about: data.about }),
                        ...(data.capacity !== undefined && { capacity: data.capacity }),
                    }
                })
        )
        invalidate(cacheKeys.committeeByEventIdAndCommitteeId("*", result.eventId));
        invalidate(cacheKeys.committeeId(result.id));
        return result;
    }

    async deleteCommittee(data: DeleteCommitteeInputType): Promise<Committee> {
        const result = await measureQuery(
            "deleteCommittee",
            () => 
                prisma.committee.delete({
                    where: {
                        id: data.committeeId
                    }
                })
        )
        invalidate(cacheKeys.committeeByEventIdAndCommitteeId("*", result.eventId));
        invalidate(cacheKeys.committeeId(result.id));
        return result;
    }

}