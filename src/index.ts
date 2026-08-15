import { app } from "./app";
import { env } from "./config/env.config";
import { logger } from "./config/logger";
import redis from "./lib/redis";
import { prisma } from "./lib/prisma";

const port = Number(env.PORT);

app.listen(port, ({ hostname, port}) => {
    logger.info(`Server is running at http://${hostname}:${port}`);
})

let shuttingDown = false;

const gracefulShutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;

    logger.info(`${signal} received Shutting down gracefully`)

    const timeout = setTimeout(() => {
        logger.error("Shutdown timed out, forcing exit");
        process.exit(1);
    }, 10_000)
    timeout.unref?.()

    try {
        await app.stop();
        await prisma.$disconnect();
        logger.info("Database disconnected")
        await redis.quit();
        logger.info("Redis disconnected")
        process.exit(0);
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", (error) => {
    logger.error(error)
    process.exit(1)
})


process.on("unhandledRejection", (error) => {
    logger.error(error)
    process.exit(1)
})