import { Message, Ticket, TicketConfigOAuthToken, User } from "../../../.prisma/client";
import { prisma } from "../../lib/prisma";
import { cachedQuery, invalidate } from "../../utils/common/helpers/CacheQuery";
import { measureQuery } from "../../utils/common/helpers/MeasureQuery";
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import { ITicketRepository } from "./ticket.interface";
import { CreateTicketInputType } from "./ticket.schema";

export class TicketRepository implements ITicketRepository {
    async createTicket(data: CreateTicketInputType, ticketId: string, user: User | null): Promise<Ticket> {
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
                    ...(name !== undefined && { name }),
                },
                update: {
                    refreshToken,
                    accessToken,
                    expiresAt: expiryDate,
                    email,
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
}