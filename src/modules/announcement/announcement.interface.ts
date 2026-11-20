import { Announcement, Committee, Event, Member, Team } from "../../../.prisma/client";
import { CreateAnnouncementData } from "./announcement.types";

export interface IAnnouncementRepository {
    getEventById(eventId: string): Promise<Event | null>;
    getCommitteeById(committeeId: string): Promise<Committee | null>;
    getTeamByUser(userId: string, eventId: string): Promise<Team | null>;
    getMemberByUser(userId: string, eventId: string): Promise<Member | null>;
    countMembers(ids: string[], eventId: string, committeeId?: string): Promise<number>;
    createAnnouncement(data: CreateAnnouncementData): Promise<Announcement>;
}