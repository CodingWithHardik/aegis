import { Announcement } from "../../../.prisma/client";

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