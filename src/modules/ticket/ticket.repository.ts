import { Message, Team, Ticket, TicketConfigOAuthToken, User } from "../../../.prisma/client";
import { prisma } from "../../lib/prisma";
import { cachedQuery, invalidate } from "../../utils/common/helpers/CacheQuery";
import { measureQuery } from "../../utils/common/helpers/MeasureQuery";
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import { ITicketRepository } from "./ticket.interface";
import { CreateTicketInputType } from "./ticket.schema";
import { TicketWithMessage } from "./ticket.types";

export class TicketRepository implements ITicketRepository {
    async createTicket(data: CreateTicketInputType, ticketId: string, user: User | null): Promise<TicketWithMessage> {
        return measureQuery("createTicket", () =>
            prisma.ticket.create({
                data: {
                    ticketId,
                    customerName: data.name,
                    customerEmail: data.email,
                    customerPhoneNo: data.phoneNo,
                    status: "OPEN",
                    message: {
                        create: {
                            direction: "INBOUND",
                            source: "WEBSITE",
                            isFirst: true,
                            senderEmail: data.email,
                            text: data.message,
                        }
                    },
                    ...(user ? { user: { connect: { id: user.id }}} : {})
                },
                include: {
                    message: true,
                }
            })
        )
    }

    async updateTicketId(id: string, ticketId: string): Promise<Ticket> {
        return measureQuery("updateTicketId", () =>
            prisma.ticket.update({
                where: {
                    id
                },
                data: {
                    ticketId,
                }
            })
        )
    }

    async addTicketMessageId(id: string, messageId: string): Promise<Message> {
        return measureQuery("addTicketMessageId", () =>
            prisma.message.update({
                where: {
                    id,
                },
                data: {
                    emailMessageId: messageId,
                }
            })
        )
    }

    async manageTicketConfig(refreshToken: string, accessToken: string, expiryDate: Date, email: string, name?: string): Promise<TicketConfigOAuthToken> {
        invalidate(cacheKeys.ticketConfig())
        return measureQuery("manageConfig", () =>
            prisma.ticketConfigOAuthToken.upsert({
                where: {
                    id: 1,
                },
                create: {
                    refreshToken,
                    accessToken,
                    expiresAt: expiryDate,
                    email,
                    historyId: null,
                    disconnectedAt: null,
                    ...(name !== undefined && { name }),
                },
                update: {
                    refreshToken,
                    accessToken,
                    expiresAt: expiryDate,
                    email,
                    historyId: null,
                    disconnectedAt: null,
                    ...(name !== undefined && { name }),
                },
            })
        )
    }

    async getTicketConfig(): Promise<TicketConfigOAuthToken | null> {
        return cachedQuery(
            "getTicketConfig",
            {
                key: cacheKeys.ticketConfig(),
                ttl: 600,
            },
            () => 
                prisma.ticketConfigOAuthToken.findUnique({
                    where: {
                        id: 1
                    }
                })
        )
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return cachedQuery(
            "findUserByEmail",
            { key: cacheKeys.userByEmail(email), ttl: 600 },
            () => 
                prisma.user.findUnique({
                    where: {
                        email,
                    }
                })
        )
    }

    async getActiveYearTeam(userId: string): Promise<Team | null> {
        return measureQuery("getActiveYearTeam", () =>
            prisma.team.findFirst({
                where: {
                    userId,
                    event: {
                        year: new Date().getFullYear(),
                        isDeleted: false,
                        status: "ACTIVE"
                    }
                }
            })
        )
    }

    async getTicketById(id: string): Promise<Ticket | null> {
        return measureQuery("getTicketById", () => 
            prisma.ticket.findUnique({
                where: {
                    id,
                }
            })
        )
    }

    async getMessages(id: string): Promise<Message[]> {
        return measureQuery("getMessages", () =>
            prisma.message.findMany({
                where: {
                    isDeleted: false,
                    ticketId: id,
                },
                orderBy: [{ createdAt: "asc" }, { isFirst: "desc" }]
            })
        )
    }

    async addMessage(ticketId: string, isStaff: boolean, senderEmail: string, message: string, messageId: string | null, lastMessagedbId: string | null): Promise<Message> {
        return measureQuery("addMessage", () => 
            prisma.message.create({
                data: {
                    ticket: {
                        connect: {
                            id: ticketId
                        }
                    },
                    direction: isStaff ? "OUTBOUND" : "INBOUND",
                    source: isStaff ? "ADMIN" : "WEBSITE",
                    senderEmail,
                    text: message,
                    ...(messageId ? { emailMessageId: messageId } : {}),
                    ...(lastMessagedbId ? {
                        parentReply: {
                            connect: {
                                id: lastMessagedbId
                            }
                        }
                    } : null) 
                }
            })
        )
    }
}