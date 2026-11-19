import { prisma } from "../../lib/prisma";
import { IMailWatcherRepository } from "./mailWatcher.interface";

export const MailWatcherRepository: IMailWatcherRepository = {
    async getAccount() {
        const config = await prisma.ticketConfigOAuthToken.findUnique({
            where: {
                id: 1
            }
        })
        if (!config) return null;
        return {
            email: config.email,
            refreshToken: config.refreshToken,
            accessToken: config.accessToken,
            expiresAt: config.expiresAt,
            historyId: config.historyId,
            disconnected: config.disconnectedAt != null
        }
    },
    
    async saveTokens(refreshToken, t) {
        await prisma.ticketConfigOAuthToken.update({
            where: { id: 1, refreshToken },
            data: {
                ...(t.accessToken ? { accessToken: t.accessToken }: {}),
                ...(t.expiresAt ? { expiresAt: t.expiresAt }: {}),
                ...(t.refreshToken ? { refreshToken: t.refreshToken }: {})
            }
        })
    },

    async saveHistoryId(refreshToken: string, historyId: string) {
        await prisma.ticketConfigOAuthToken.update({
            where: {
                id: 1,
                refreshToken,
            },
            data: {
                historyId,
            }
        })
    },

    async markDisconnected(refreshToken) {
        await prisma.ticketConfigOAuthToken.update({
            where: {
                id: 1,
                refreshToken,
            },
            data: {
                disconnectedAt: new Date()
            }
        })
    },

    async findMessageByEmailIds(localParts) {
        if (!localParts.length) return [];
        return prisma.message.findMany({
            where: {
                isDeleted: false,
                OR: localParts.flatMap((l) => [
                    { emailMessageId: l },
                    { emailMessageId: { startsWith: `<${l}@` } },
                    { emailMessageId: { startsWith: `${l}@` } }
                ])
            },
            select: {
                id: true,
                ticketId: true,
                emailMessageId: true,
            }
        })
    },

    async findTicketByTCEId(ticketId) {
        return prisma.ticket.findUnique({
            where: { ticketId },
            select: {
                id: true,
                customerEmail: true,
            }
        })
    },

    async findLastMessageId(ticketDbId) {
        const message = await prisma.message.findFirst({
            where: {
                ticketId: ticketDbId,
                isDeleted: false
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true
            }
        })
        return message?.id ?? null;
    },

    async saveMessage(message) {
        try {
            return await prisma.message.create({
                data: {
                    ticket: {
                        connect: {
                            id: message.ticketDbId
                        }
                    },
                    direction: "INBOUND",
                    source: "MAIL",
                    senderEmail: message.senderEmail,
                    text: message.text,
                    emailMessageId: message.emailMessageId,
                    ...(message.parentMessageId 
                        ? {
                            parentReply: {
                                connect: {
                                    id: message.parentMessageId
                                }
                            }
                        } : {}
                    )
                },
                select: {id: true}
            })
        } catch (error: any) {
            throw error
        }
    },
}