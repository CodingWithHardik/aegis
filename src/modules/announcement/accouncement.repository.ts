import { Announcement, Committee, Event, Member, Team } from "../../../.prisma/client";
import { AnnouncementWhereInput } from "../../../.prisma/models";
import { prisma } from "../../lib/prisma";
import { cachedQuery } from "../../utils/common/helpers/CacheQuery";
import { measureQuery } from "../../utils/common/helpers/MeasureQuery";
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import { IAnnouncementRepository } from "./announcement.interface";
import { AnnouncementListType, CreateAnnouncementData } from "./announcement.types";

export class AnnouncementRepository implements IAnnouncementRepository {
    async getEventById(eventId: string): Promise<Event | null> {
        return cachedQuery("getEventById", 
            {
                key: cacheKeys.event(eventId),
                ttl: 600,
            },
            () => 
                prisma.event.findUnique({
                    where: {
                        id: eventId
                    }
                })
        )
    }

    async getCommitteeById(committeeId: string): Promise<Committee | null> {
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

    async getTeamByUser(userId: string, eventId: string): Promise<Team | null> {
        return measureQuery(
            "getTeamByUser",
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

    async getMemberByUser(userId: string, eventId: string): Promise<Member | null> {
        return measureQuery(
            "getMemberByUser",
            () => 
                prisma.member.findUnique({
                    where: {
                        eventId_userId: {
                            eventId,
                            userId,
                        }
                    }
                })
        )
    }

    async countMembers(ids: string[], eventId: string, committeeId?: string): Promise<number> {
        return measureQuery(
            "countMembers",
            () =>
                prisma.member.count({
                    where: {
                        id: {
                            in: ids,
                        },
                        eventId,
                        ...(committeeId ? { committeeId } : {})
                    }
                })
        )
    }

    async createAnnouncement(data: CreateAnnouncementData): Promise<Announcement> {
        return measureQuery(
            "createAnnouncement",
            () => 
                prisma.announcement.create({
                    data: {
                        title: data.title,
                        text: data.text,
                        priority: data.priority,
                        isPinned: data.isPinned,
                        audience: data.audience,
                        eventId: data.eventId,
                        committeeId: data.committeeId,
                        authorId: data.authorId,
                        expiresAt: data.expiresAt,
                        ...(data.memberIds.length > 0 && {
                            recipients: {
                                create: data.memberIds.map((memberId) => ({
                                    memberId
                                })) 
                            }
                        })
                    }
                })
        )
    }

    async getAnnouncement(where: AnnouncementWhereInput, memberId: string | null, page: number, limit: number): Promise<{ items: AnnouncementListType[]; total: number; }> {
        const [items, total] = await measureQuery(
            "getAnnouncement",
            () => 
                prisma.$transaction([
                    prisma.announcement.findMany({
                        where,
                        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
                        skip: (page - 1) * limit,
                        take: limit,
                        include: {
                            author: {
                                select: { id: true, name: true }
                            },
                            committee: {
                                select: { id: true, name: true, slug: true }
                            },
                            recipients: {
                                where: { memberId: memberId ?? "" },
                                select: { readAt: true }
                            }
                        }
                    }),
                    prisma.announcement.count({ where })
                ])
        )
        return { items, total }
    }
}