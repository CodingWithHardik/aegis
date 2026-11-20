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