import { Member, Role, User } from "../../../.prisma/client";
import { prisma } from "../../lib/prisma";
import { cachedQuery, invalidate } from "../../utils/common/helpers/CacheQuery";
import { measureQuery } from "../../utils/common/helpers/MeasureQuery";
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import { IRegisterRepository } from "./register.interface";
import { AcceptPaymentInputType, AllotCommitteeInputType, CreateMemberInputType, DeleteMemberInputType, GetRegisterInputType, PaymentChangeInputType, RoleChangeInputType, StatusChangeInputType, UpdateMemberInputType } from "./register.schema";

export class RegisterRepository implements IRegisterRepository {
    async getRegisteration(data: GetRegisterInputType): Promise<Member[]> {
        return cachedQuery(
            "getRegisteration",
            {
                key: cacheKeys.register(data.id, data.eventId, data.userId),
                ttl: 600,
            },
            () => 
                prisma.member.findMany({
                    where: {
                        ...(data.id !== undefined && { id: data.id }),
                        ...(data.eventId !== undefined && { eventId: data.eventId }),
                        ...(data.userId !== undefined && { userId: data.userId }),
                        ...(data.role !== undefined && { role: data.role }),
                        ...(data.committeeId !== undefined && { committeeId: data.committeeId }),
                        ...(data.applicationStatus !== undefined && { applicationStatus: data.applicationStatus }),
                        ...(data.paymentType !== undefined && { paymentType: data.paymentType }),
                    }
                })
        )
    }

    async getRegisterationById({ id }: { id: string }): Promise<Member | null> {
        return cachedQuery(
            "getRegisterationById",
            {
                key: cacheKeys.registerationId(id),
                ttl: 600
            }, 
            () => 
                prisma.member.findUnique({
                    where: {
                        id,
                    }
                })
        )
    }

    async getRoleByEventIdAdnUserId({ eventId, userId }: { eventId: string, userId: string }): Promise<{ role: Role } | null> {
        return cachedQuery(
            "getRoleByEventIdAdnUserId",
            {
                key: cacheKeys.teamByEventIdAndUserId(eventId, userId),
                ttl: 600,
            },
            () =>
                prisma.team.findUnique({
                    where: {
                        eventId_userId: {
                            eventId,
                            userId,
                        },
                    },
                    select: {
                        role: true
                    }
                })
        )
    }

    async registerMember(data: CreateMemberInputType, user: User): Promise<Member> {
        const result = await measureQuery(
            "registerMember",
            () =>
                prisma.member.create({
                    data: {
                        ...data,
                        userId: user.id,
                    },
                })
        )
        invalidate(cacheKeys.registerationId(result.id))
        invalidate(cacheKeys.register(result.id, "*", "*"))
        invalidate(cacheKeys.register("*", result.eventId, result.userId))
        return result;
    }

    async updateMember(data: UpdateMemberInputType): Promise<Member> {
        const result = await measureQuery(
            "updateMember",
            () =>
                prisma.member.update({
                    where: data.memberId ?
                        {
                            id: data.memberId
                        } : 
                        {
                            eventId_userId: {
                                eventId: data.eventId!,
                                userId: data.userId!
                            }
                        },
                    data: {
                        ...(data.name !== undefined && { name: data.name }),
                        ...(data.about !== undefined && { about: data.about }),
                        ...(data.class !== undefined && { class: data.class }),
                        ...(data.section !== undefined && { section: data.section }),
                        ...(data.munExperience !== undefined && { munExperience: data.munExperience }),
                        ...(data.munAchievements !== undefined && { munAchievements: data.munAchievements }),
                        ...(data.additionalInfo !== undefined && { additionalInfo: data.additionalInfo }),
                    }
                })
        )
        invalidate(cacheKeys.registerationId(result.id))
        invalidate(cacheKeys.register(result.id, "*", "*"))
        invalidate(cacheKeys.register("*", result.eventId, result.userId))
        return result;
    }

    async deleteMember(data: DeleteMemberInputType): Promise<Member> {
        const result = await measureQuery(
            "deleteMember",
            () =>
                prisma.member.delete({
                    where: data.memberId ?
                        {
                            id: data.memberId
                        } : 
                        {
                            eventId_userId: {
                                eventId: data.eventId!,
                                userId: data.userId!
                            }
                        }
                })
        )
        invalidate(cacheKeys.registerationId(result.id))
        invalidate(cacheKeys.register(result.id, "*", "*"))
        invalidate(cacheKeys.register("*", result.eventId, result.userId))
        return result;
    }

    async roleChange(data: RoleChangeInputType): Promise<Member> {
        const result = await measureQuery(
            "roleChange",
            () =>
                prisma.member.update({
                    where: data.memberId ?
                        {
                            id: data.memberId
                        } :
                        {
                            eventId_userId: {
                                eventId: data.eventId!,
                                userId: data.userId!
                            }
                        },
                    data: {
                        role: data.role
                    }
                })
        )
        invalidate(cacheKeys.registerationId(result.id))
        invalidate(cacheKeys.register(result.id, "*", "*"))
        invalidate(cacheKeys.register("*", result.eventId, result.userId))
        return result;
    }

    async statusChange(data: StatusChangeInputType): Promise<Member> {
        const result = await measureQuery(
            "applicationStatusChange",
            () =>
                prisma.member.update({
                    where: data.memberId ?
                        {
                            id: data.memberId
                        } :
                        {
                            eventId_userId: {
                                eventId: data.eventId!,
                                userId: data.userId!
                            }
                        },
                    data: {
                        applicationStatus: data.applicationStatus
                    }
                })
        )
        invalidate(cacheKeys.registerationId(result.id))
        invalidate(cacheKeys.register(result.id, "*", "*"))
        invalidate(cacheKeys.register("*", result.eventId, result.userId))
        return result;
    }

    async paymentModeChange(data: PaymentChangeInputType): Promise<Member> {
        const result = await measureQuery(
            "paymentModeChange",
            () =>
                prisma.member.update({
                    where: data.memberId ?
                        {
                            id: data.memberId
                        } :
                        {
                            eventId_userId: {
                                eventId: data.eventId!,
                                userId: data.userId!
                            }
                        },
                    data: {
                        paymentType: data.paymentType,
                        ...(data.paymentLink !== undefined && { paymentLink: data.paymentLink })
                    }
                })
        )
        invalidate(cacheKeys.registerationId(result.id))
        invalidate(cacheKeys.register(result.id, "*", "*"))
        invalidate(cacheKeys.register("*", result.eventId, result.userId))
        return result;
    }

    async acceptPayment(data: AcceptPaymentInputType): Promise<Member> {
        const result = await measureQuery(
            "acceptPayment",
            () =>
                prisma.member.update({
                    where: data.memberId ?
                        {
                            id: data.memberId
                        } :
                        {
                            eventId_userId: {
                                eventId: data.eventId!,
                                userId: data.userId!
                            }
                        },
                    data: {
                        applicationStatus: "PROCESSED"
                    }
                })
        )
        invalidate(cacheKeys.registerationId(result.id))
        invalidate(cacheKeys.register(result.id, "*", "*"))
        invalidate(cacheKeys.register("*", result.eventId, result.userId))
        return result;
    }

    async allotCommittee(data: AllotCommitteeInputType): Promise<Member> {
        const result = await measureQuery(
            "allotCommittee",
            () => 
                prisma.member.update({
                    where: data.memberId ?
                        {
                            id: data.memberId
                        } :
                        {
                            eventId_userId: {
                                eventId: data.eventId!,
                                userId: data.userId!
                            }
                        },
                    data: {
                        committee: {
                            connect: {
                                id: data.committeeId,
                            }
                        },
                        portfolio: data.portfolio,
                    }
                })
        )
        invalidate(cacheKeys.registerationId(result.id))
        invalidate(cacheKeys.register(result.id, "*", "*"))
        invalidate(cacheKeys.register("*", result.eventId, result.userId))
        return result;
    }
}