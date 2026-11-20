import { Announcement, Member, User } from "../../../.prisma/client";
import { logger } from "../../config/logger";
import { AppError } from "../../utils/common/Errors/AppError";
import { buildMemberVisibility, buildTeamVisibility, toPaginationMeta } from "./announcement.helper";
import { IAnnouncementRepository } from "./announcement.interface";
import { toAnnouncementListResponse, toAnnouncementResponse } from "./announcement.response";
import { CreateAnnouncementInputType, ListAnnouncementInputType } from "./announcement.schema";

export class AnnouncementService {
    constructor(private announcementRepo: IAnnouncementRepository) {}

    private async resolveAccess(user: User, eventId: string): Promise<{ isTeam: boolean; member: Member | null }> {
        const [team, member] = await Promise.all([
            this.announcementRepo.getTeamByUser(user.id, eventId),
            this.announcementRepo.getMemberByUser(user.id, eventId)
        ])

        return {
            isTeam: user.isSuperAdmin || !!team,
            member,
        }
    }

    async createAnnouncement(data: CreateAnnouncementInputType, user: User) {
        const event = await this.announcementRepo.getEventById(data.eventId);
        if (!event || event.isDeleted) {
            throw new AppError("Event Not Found", 422)
        }
        if (data.committeeId) {
            const committee = await this.announcementRepo.getCommitteeById(data.committeeId)
            if (!committee || committee.eventId !== data.committeeId) {
                throw new AppError("Committee Not Found", 422)
            }
        }
        const { isTeam, member } = await this.resolveAccess(user, data.eventId);
        const memberIds = data.membersIds ?? []
        let scopeMemberCommitteeId: string | undefined;
        if (!isTeam) {
            if (!member || member.role !== "BOARD_MEMBER" || !member.committeeId) {
                throw new AppError("Unauthorized", 403)
            }
            const isOwnCommittee = data.audience === "COMMITTEE"
                && data.committeeId === member.committeeId;
            const isTargeted = data.audience === "MEMBERS";
            if (!isOwnCommittee && !isTargeted) {
                throw new AppError("Unauthorized", 403)
            }

            scopeMemberCommitteeId = member.committeeId;
        }
        if (data.audience === "MEMBERS") {
            const count = await this.announcementRepo.countMembers(memberIds, data.eventId, scopeMemberCommitteeId)
            if (count !== memberIds.length) {
                throw new AppError("Some members are not part of the evnt or your committee", 422)
            }
        }

        const announcement = await this.announcementRepo.createAnnouncement({
            title: data.title,
            text: data.text,
            priority: data.priority,
            isPinned: data.isPinned,
            audience: data.audience,
            eventId: data.eventId,
            committeeId: data.committeeId ?? null,
            authorId: user.id,
            publishedAt: new Date(),
            expiresAt: data.expiresAt ?? null,
            memberIds,
        })

        logger.info({
            event: "ANNOUNCEMENT_CREATED",
            userId: user.id,
            announcementId: announcement.id,
            eventId: data.eventId,
            audience: data.audience,
            committeeId: data.committeeId ?? null,
            recipients: memberIds.length,
        })

        return toAnnouncementResponse(announcement)
    } 

    async getAnnouncement(data: ListAnnouncementInputType, user: User) {
        const event = await this.announcementRepo.getEventById(data.eventId);
        if (!event || event.isDeleted) {
            throw new AppError("Event Not found", 422)
        }

        const { isTeam, member } = await this.resolveAccess(user, data.eventId)
        let where;
        if (isTeam) {
            where = buildTeamVisibility(data.eventId);
        } else if (member) {
            where = buildMemberVisibility(member, new Date())
        } else {
            throw new AppError("Unauthorized", 403)
        }

        const { items, total } = await this.announcementRepo.getAnnouncement(
            where,
            member?.id ?? null,
            data.page,
            data.limit,
        )

        return toAnnouncementListResponse(items, toPaginationMeta(data.page, data.limit, total))
    }
}