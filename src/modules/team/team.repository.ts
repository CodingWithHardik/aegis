import { Role, Team } from "../../../.prisma/client";
import { prisma } from "../../lib/prisma";
import { cachedQuery } from "../../utils/common/helpers/CacheQuery";
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import { ITeamRepository } from "./team.interface";
import { GetTeamInputType } from "./team.schema";

export class TeamRepository implements ITeamRepository {
    async getTeam(data: GetTeamInputType): Promise<Team[] | null> {
        return cachedQuery(
            "getTeam",
            {
                key: cacheKeys.teamByMultiCriteria(data.teamId, data.eventId, data.userId, data.role),
                ttl: 600,
            },
            (() => 
                prisma.team.findMany({
                    where: {
                        ...(data.teamId && { id: data.teamId }),
                        ...(data.eventId && { eventId: data.eventId }),
                        ...(data.userId && { userId: data.userId }),
                        ...(data.role && { role: data.role }),
                    }
                })
            )
        )
    }

    async getTeamByEventIdAndUserId(eventId: string, userId: string): Promise<{ role: Role } | null> {
        return cachedQuery(
            "getTeamByEventIdAndUserId",
            {
                key: cacheKeys.teamByEventIdAndUserId(userId, eventId),
                ttl: 600,
            }, 
            (() => 
                prisma.team.findUnique({
                    where: {
                        eventId_userId: {
                            eventId,
                            userId,
                        }
                    },
                    select: {
                        role: true,
                    }
                })
            )
        )
    }

    async getTeamByTeamIdAndUserId(teamId: string, userId: string): Promise<{ role: Role; } | null> {
        return cachedQuery(
            "getTeamByTeamIdAndUserId",
            {
                key: cacheKeys.team(teamId),
                ttl: 600,
            }, 
            (() => 
                prisma.team.findUnique({
                    where: {
                        id: teamId,
                        userId: userId,
                    },
                    select: {
                        role: true,
                    }
                })
            )
        )
    }
}