import { Member, Role } from "../../../.prisma/client";
import { prisma } from "../../lib/prisma";
import { cachedQuery } from "../../utils/common/helpers/CacheQuery";
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import { IRegisterRepository } from "./register.interface";
import { GetRegisterInputType } from "./register.schema";

export class RegisterRepository implements IRegisterRepository {
    async getRegisteration(data: GetRegisterInputType): Promise<Member[]> {
        return cachedQuery(
            "getRegisteration",
            {
                key: cacheKeys.register(data.id, data.eventId, data.userId),
                ttl: 600,
            },
            () => 
                prisma.member.findMany({
                    where: {
                        ...(data.id !== undefined && { id: data.id }),
                        ...(data.eventId !== undefined && { eventId: data.eventId }),
                        ...(data.userId !== undefined && { userId: data.userId }),
                        ...(data.role !== undefined && { role: data.role }),
                        ...(data.committeeId !== undefined && { committeeId: data.committeeId }),
                        ...(data.applicationStatus !== undefined && { applicationStatus: data.applicationStatus }),
                        ...(data.paymentType !== undefined && { paymentType: data.paymentType }),
                    }
                })
        )
    }

    async getRegisterationById({ id }: { id: string }): Promise<Member | null> {
        return cachedQuery(
            "getRegisterationById",
            {
                key: cacheKeys.registerationId(id),
                ttl: 600
            }, 
            () => 
                prisma.member.findUnique({
                    where: {
                        id,
                    }
                })
        )
    }

    async getRoleByEventIdAdnUserId({ eventId, userId }: { eventId: string, userId: string }): Promise<{ role: Role } | null> {
        return cachedQuery(
            "getRoleByEventIdAdnUserId",
            {
                key: cacheKeys.teamByEventIdAndUserId(eventId, userId),
                ttl: 600,
            },
            () =>
                prisma.team.findUnique({
                    where: {
                        eventId_userId: {
                            eventId,
                            userId,
                        },
                    },
                    select: {
                        role: true
                    }
                })
        )
    }
}