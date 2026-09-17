import { Team } from "../../../.prisma/client";
import { prisma } from "../../lib/prisma";
import { cachedQuery, invalidate } from "../../utils/common/helpers/CacheQuery";
import { measureQuery } from "../../utils/common/helpers/MeasureQuery";
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import { ITeamRepository } from "./team.interface";
import { AddMemberInputType, DeleteMemberInputType, GetTeamInputType, UpdateMemberInputType } from "./team.schema";

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

    async getTeamByEventIdAndUserId(eventId: string, userId: string): Promise<Team | null> {
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
                    }
                })
            )
        )
    }

    async getTeamByTeamId(teamId: string): Promise<Team | null> {
        return cachedQuery(
            "getTeamByTeamId",
            {
                key: cacheKeys.team(teamId),
                ttl: 600,
            }, 
            (() => 
                prisma.team.findUnique({
                    where: {
                        id: teamId,
                    }
                })
            )
        )
    }

    async createTeam(data: AddMemberInputType): Promise<Team> {
        await invalidate(cacheKeys.teamByEventIdAndUserId(data.userId, data.eventId));
        const result = await measureQuery(
            "createTeam",
            () =>
                prisma.team.create({
                    data: {
                        name: data.name,
                        ...(data.about ? { about: data.about } : null),
                        role: data.role,
                        event: {
                            connect: {
                                id: data.eventId,
                            }
                        },
                        user: {
                            connect: {
                                id: data.userId,
                            }
                        }
                    }
                })
        )
        await invalidate(cacheKeys.team(result.id));
        await invalidate(cacheKeys.teamByMultiCriteria("*", result.eventId, "*", "*"));
        await invalidate(cacheKeys.teamByMultiCriteria("*", "*", result.userId, "*"));
        await invalidate(cacheKeys.teamByMultiCriteria(result.id, "*", "*", "*"));
        await invalidate(cacheKeys.teamByMultiCriteria(undefined, undefined, undefined, undefined));
        return result;
    }

    async updateTeam(data: UpdateMemberInputType): Promise<Team> {
        const result = await measureQuery(
            "updateTeam",
            async () => 
                prisma.team.update({
                    where: {
                        ...(data.teamId) ?
                        {
                            id: data.teamId,
                        } : {
                            eventId_userId: {
                                eventId: data.eventId!,
                                userId: data.userId!,
                            }
                        }
                    },
                    data: {
                        ...(data.name && { name: data.name }),
                        ...(data.about && { about: data.about }),
                        ...(data.role && { role: data.role }),
                    }
                })
        )
        await invalidate(cacheKeys.teamByEventIdAndUserId(result.userId, result.eventId));
        await invalidate(cacheKeys.team(result.id));
        await invalidate(cacheKeys.teamByMultiCriteria("*", result.eventId, "*", "*"));
        await invalidate(cacheKeys.teamByMultiCriteria("*", "*", result.userId, "*"));
        await invalidate(cacheKeys.teamByMultiCriteria(result.id, "*", "*", "*"));
        await invalidate(cacheKeys.teamByMultiCriteria(undefined, undefined, undefined, undefined));
        return result;
    }

    async deleteTeam(data: DeleteMemberInputType): Promise<Team> {
        const result = await measureQuery(
            "deleteTeam",
            async () => 
                prisma.team.delete({
                    where: {
                        ...(data.teamId) ?
                        {
                            id: data.teamId
                        } : {
                            eventId_userId: {
                                eventId: data.eventId!,
                                userId: data.userId!,
                            }
                        }
                    }
                })
        )
        await invalidate(cacheKeys.teamByEventIdAndUserId(result.userId, result.eventId));
        await invalidate(cacheKeys.team(result.id));
        await invalidate(cacheKeys.teamByMultiCriteria("*", result.eventId, "*", "*"));
        await invalidate(cacheKeys.teamByMultiCriteria("*", "*", result.userId, "*"));
        await invalidate(cacheKeys.teamByMultiCriteria(result.id, "*", "*", "*"));
        await invalidate(cacheKeys.teamByMultiCriteria(undefined, undefined, undefined, undefined));
        return result;
    }
}