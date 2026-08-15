import Elysia from "elysia";
import { env } from "../config/env.config";
import { logger } from "../config/logger";

const INSTANCE_NAME = env.HOSTNAME ?? "unknown";

const startTimes = new WeakMap<Request, number>();

export const requestLogger = new Elysia({
    name: "request-logger"
})
.onRequest(({ request }) => {
    startTimes.set(request, performance.now());
})
.onAfterResponse(({ request, set, server }) => {
    const start = startTimes.get(request);
    const durationMs = start === undefined ? 0 : performance.now() - start;
    startTimes.delete(request)

    logger.info({
        event: "HTTP_REQUEST",
        method: request.method,
        path: request.url.slice(request.url.indexOf("/", 8)),
        statusCode: set.status ?? 200,
        served_by: INSTANCE_NAME,
        ip: 
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            server?.requestIP(request)?.address,
        durationMs: Number(durationMs.toFixed(2)),
    })
})
.as("global")