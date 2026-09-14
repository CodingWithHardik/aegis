import { Role } from "../../../../.prisma/enums";

export const cacheKeys = {
    user: (userId: string) => `user:${userId}`,
    userByEmail: (email: string) => `user:email:${email}`,
    accessToken: (token: string) => `accessToken:${token}`,
    event: (eventId: string) => `event:${eventId}`,
    eventByYearAndType: (year: number, type: "INTRA" | "MAIN") => `event:${year}:${type}`,
    getEventByUser: (userId: string) => `event:user:${userId}`,
    teamByEventIdAndUserId: (userId: string, eventId: string) => `team:eventId:${eventId}:userId:${userId}`,
    team: (teamId: string) => `team:teamId:${teamId}`,
    teamByMultiCriteria: (teamId?: string, eventId?: string, userId?: string, role?: Role | "*") => `team:teamId:${teamId}:eventId:${eventId}:userId:${userId}:role:${role}`
}