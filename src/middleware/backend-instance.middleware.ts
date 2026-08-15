import Elysia from "elysia";
import { env } from "../config/env.config";
import { logger } from "../config/logger"

const INSTANCE_NAME = env.HOSTNAME ?? "unknown";

export const backendInstance = new Elysia({
    name: "backend-instance"
})
.onRequest(({ set }) => {
    set.headers["x-backend-instance"] = INSTANCE_NAME;
    logger.info({ served_by: INSTANCE_NAME })
})
.as("global");