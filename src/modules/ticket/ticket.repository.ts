import { TicketConfigOAuthToken } from "../../../.prisma/client";
import { prisma } from "../../lib/prisma";
import { cachedQuery, invalidate } from "../../utils/common/helpers/CacheQuery";
import { measureQuery } from "../../utils/common/helpers/MeasureQuery";
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import { ITicketRepository } from "./ticket.interface";

export class TicketRepository implements ITicketRepository {
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
}