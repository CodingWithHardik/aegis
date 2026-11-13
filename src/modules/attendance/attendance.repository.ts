import { Attendance, Committee, Event, Member } from "../../../.prisma/client";
import { prisma } from "../../lib/prisma";
import { cachedQuery } from "../../utils/common/helpers/CacheQuery";
import { measureQuery } from "../../utils/common/helpers/MeasureQuery";
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import { IAttendanceRepository } from "./attendance.interface";
import { AttendanceUserTypes } from "./attendance.types";

export class AttendanceRepository implements IAttendanceRepository {
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
                    },
                })
        )
    }

    async getMembersByCommitteeId(committeeId: string, ids: string[]): Promise<Member[]> {
        return measureQuery(
            "getMembersByCommitteeId",
            () =>
                prisma.member.findMany({
                    where: {
                        id: {
                            in: ids,
                        },
                        committeeId,
                        role: "MEMBER",
                    },
                })
        )
    }
    
    async getBoardMember(userId: string, committeeId: string, eventId: string): Promise<Member | null> {
        return measureQuery(
            "getBoardMember",
            () => 
                prisma.member.findUnique({
                    where: {
                        eventId_userId: {
                            eventId,
                            userId,
                        },
                        committeeId,
                        role: "BOARD_MEMBER",
                    }
                })
        )
    }

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

    async markAttendance(users: AttendanceUserTypes, committeeId: string, eventId: string, date: Date): Promise<Attendance[]> {
        return measureQuery("markAttendance",
            () => 
                prisma.$transaction(
                    users.map((newData) => 
                        prisma.attendance.upsert({
                            where: {
                                memberId_committeeId_date: {
                                    memberId: newData.memberId,
                                    committeeId,
                                    date: date,
                                }
                            },
                            update: {
                                isPresent: newData.isPresent,
                            },
                            create: {
                                isPresent: newData.isPresent,
                                date: date,
                                member: {
                                    connect: {
                                        id: newData.memberId,
                                    }
                                },
                                committee: {
                                    connect: {
                                        id: committeeId,
                                    }
                                },
                                event: {
                                    connect: {
                                        id: eventId,
                                    }
                                }
                            }
                        })
                    )
                )
        )
    }
}