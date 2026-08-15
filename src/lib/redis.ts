import { Redis } from "ioredis";
import { env } from "../config/env.config";
import { logger } from "../config/logger";

export const redisConnection = {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    ...(env.REDIS_USERNAME && env.REDIS_PASSWORD ? {
        username: env.REDIS_USERNAME,
        password: env.REDIS_PASSWORD,
    } : {}),
    maxRetriesPerRequest: null,
}

export const redis = new Redis(redisConnection);

redis.on("connect", () => {
    logger.info("Redis connected successfully")
})
redis.on("ready", async () => {
    logger.info("Redis is Ready");
})
redis.on("error", (error) => {
    logger.error({
        status: false,
        message: "Redis failed to connect",
        error
    })
})

export default redis;