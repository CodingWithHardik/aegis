import { Announcement } from "../../../.prisma/client";
import { AnnouncementListType, PaginationMeta } from "./announcement.types";

export const toAnnouncementResponse = (announcement: Announcement) => {
    return {
        id: announcement.id,
        title: announcement.title,
        text: announcement.text,
        priority: announcement.priority,
        isPinned: announcement.isPinned,
        audience: announcement.audience,
        eventId: announcement.eventId,
        committeeId: announcement.committeeId,
        expiresAt: announcement.expiresAt,
        createdAt: announcement.createdAt,
    }
}

export const toAnnouncementListItem = (announcement: AnnouncementListType) => {
    return {
        ...toAnnouncementResponse(announcement),
        author: announcement.author,
        committee: announcement.committee,
        isRead: announcement.audience === "MEMBERS"
            ? announcement.recipients[0]?.readAt != null
            : null,
    }
}

export const toAnnouncementListResponse = (announcements: AnnouncementListType[], meta: PaginationMeta) => {
    return {
        announcements: announcements.map((announcement) => toAnnouncementListItem(announcement)),
        meta,
    }
}