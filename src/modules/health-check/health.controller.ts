import { catchAsync } from "../../utils/common/helpers/CacheAsync";
import type { Context } from "elysia";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";

export class HealthController {
    live = catchAsync(async ({ set }: Context) => {
        set.status = 200;
        return {
            success: true,
            status: "ALIVE",
            timestamp: new Date().toISOString()
        };
    });

    ready = catchAsync(async ({ set }: Context) => {
        try {
            await prisma.$queryRaw`SELECT 1`;
            await redis.ping();
            set.status = 200;
            return {
                success: true,
                status: "READY",
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            set.status = 504;
            return {
                success: false,
                status: "NOT_READY",
                timestamp: new Date().toISOString()
            }
        }
    })

    private async checkDatabaseConnection(): Promise<boolean> {
        try {
            await prisma.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            return false;
        }
    }

    private async checkRedisConnection(): Promise<boolean> {
        try {
            await redis.ping();
            return true;
        } catch (error) {
            return false;
        }
    }

    health = catchAsync(async ({ set }: Context) => {
        const isDatabaseConnected = await this.checkDatabaseConnection();
        const isRedisConnected = await this.checkRedisConnection();

        set.status = isDatabaseConnected && isRedisConnected ? 200 : 503;
        return {
            success: isDatabaseConnected && isRedisConnected,
            status: isDatabaseConnected && isRedisConnected ? "READY" : "NOT_READY",
            database: isDatabaseConnected ? "UP" : "DOWN",
            redis: isRedisConnected ? "UP" : "DOWN",
            timestamp: new Date().toISOString()
        };
    })
}