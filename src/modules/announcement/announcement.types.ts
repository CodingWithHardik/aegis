import { Announcement } from "../../../.prisma/client";
import { AnnouncementAudience, AnnouncementPriority } from "../../../.prisma/enums";

export type CreateAnnouncementData = {
    title: string;
    text: string;
    priority: AnnouncementPriority;
    isPinned: boolean;
    audience: AnnouncementAudience;
    eventId: string;
    committeeId: string | null;
    authorId: string;
    publishedAt?: Date;
    expiresAt: Date | null;
    memberIds: string[];
}

export type AnnouncementListType = Announcement & {
    author: {
        id: string;
        name: string;
    };
    committee: {
        id: string;
        name: string;
        slug: string
    } | null;
    recipients: {
        readAt: Date | null;
    }[]
}

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}