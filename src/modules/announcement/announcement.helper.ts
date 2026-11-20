import { Member } from "../../../.prisma/client";
import { AnnouncementWhereInput } from "../../../.prisma/models";
import { PaginationMeta } from "./announcement.types";

export const buildTeamVisibility = (eventId: string): AnnouncementWhereInput => {
    return {
        eventId,
        isDeleted: false
    }
}

export const buildMemberVisibility = (member: Member, now: Date): AnnouncementWhereInput => {
    const audienceFilters: AnnouncementWhereInput[] = [
        { audience: "EVENT" },
        { audience: "MEMBERS", recipients: { some: { memberId: member.id } }}
    ]
    if (member.committeeId) {
        audienceFilters.push({
            audience: "COMMITTEE",
            committeeId: member.committeeId
        })
    }
    if (member.role === "BOARD_MEMBER") {
        audienceFilters.push({
            audience: "BOARD",
            committeeId: null
        })
        if(member.committeeId) {
            audienceFilters.push({
                audience: "BOARD",
                committeeId: member.committeeId
            })
        }
    }
    return {
        eventId: member.eventId,
        isDeleted: false,
        createdAt: { lte: now },
        AND: [
            { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
            { OR: audienceFilters }
        ]
    }
}

export const toPaginationMeta = (page: number, limit: number, total: number): PaginationMeta => {
    return {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit))
    }
}