import { env } from "../../config/env.config";
import { Elysia, StatusMap } from "elysia";
import redis from "../../lib/redis"
import { logger } from "../../config/logger";

const WINDOW_MS = Number(env.LOGIN_RATE_LIMIT_WINDOW) * 60 * 1000;
const MAX = Number(env.LOGIN_RATE_LIMIT_SIZE);
const PREFIX = "rate-limit:login";

const getIp = (request: Request, server: { requestIP?: Function } | null) => 
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    server?.requestIP?.(request)?.address ??
    "unknown"

export const loginRateLimiter = new Elysia({ name: "login-rate-limit" })
.onRequest(async ({ request, server, set }) => {
    const ip = getIp(request, server);
    const key = `${PREFIX}:${ip}`

    let hits: number;
    let ttl: number;

    try {
        const res = await redis
            .multi()
            .incr(key)
            .pttl(key)
            .exec();
        
        hits = res![0][1] as number;
        ttl = res![1][1] as number;

        if (ttl < 0) {
            await redis.pexpire(key, WINDOW_MS);
            ttl = WINDOW_MS
        }
    } catch (error) {
        logger.error({ event: "RATE_LIMIT_STORE_ERROR", error });
        return;
    }

    const resetSeconds = Math.ceil(ttl / 1000);

    set.headers["ratelimit-limit"] = String(MAX);
    set.headers["ratelimit-remaining"] = String(Math.max(0, MAX - hits));
    set.headers["ratelimit-reset"] = String(resetSeconds);

    if (hits > MAX) {
        logger.warn({
            event: "LOGIN_RATE_LIMIT_EXCEEDED",
            ip,
            path: request.url.slice(request.url.indexOf("/", 8)),
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: 
                    "Login Rate Limit Message: Too many requests."
            }),
            {
                status: 429,
                headers: {
                    "content-type": "application/json",
                    "retry-after": String(resetSeconds),
                    "ratelimit-limit": String(MAX),
                    "ratelimit-remaining": "0",
                    "ratelimit-reset": String(resetSeconds),
                }
            }
        )
    }
})
.onAfterResponse(async ({ request, server, set }) => {
    const raw = set.status ?? 200;
    const status = typeof raw === "number" ? raw : StatusMap[raw];

    if (status < 200 || status >= 300) return;

    const key = `${PREFIX}:${getIp(request, server)}`;

    try {
        const remaining = await redis.decr(key);
        if (remaining <= 0) await redis.del(key);
    } catch (error) {
        logger.error({ event: "RATE_LIMIT_STORE_ERROR", error });
    }
})
.as("scoped")