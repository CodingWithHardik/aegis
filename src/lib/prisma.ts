import { PrismaClient } from "../../.prisma/client";
import { env } from "../config/env.config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { logger } from "../config/logger";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
});

pool.on("error", (err) => {
    logger.error({
        event: "POSTGRES_POOL_ERROR",
        error: err,
    })
    console.error("Unexpected error on idle PostgreSQL client", err);
})

const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
})

export { prisma };