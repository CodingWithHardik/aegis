import Elysia from "elysia";
import { AppError } from "../utils/common/Errors/AppError";
import { verifyAccessToken } from "../modules/auth/auth.helper";
import { cachedQuery } from "../utils/common/helpers/CacheQuery";
import { cacheKeys } from "../utils/common/redis/cacheKeys";
import { ttlUntil } from "../utils/common/helpers/helper.cache";
import { VerifyJwt } from "../modules/auth/auth.types";
import { User } from "../../.prisma/client";
import { prisma } from "../lib/prisma";

export const authMiddleware = new Elysia({ name: "auth-middleware" })
.decorate("user", {} as User)
.resolve(async({ headers }) => {
    const authHeader = headers.authorization;

    if (!authHeader) throw new AppError("Authentication Required", 401);
    if (!authHeader.startsWith("Bearer ")) throw new AppError("Invalid format for authentication header", 401);

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) throw new AppError("Access Token Missing", 401)

    const payload = await cachedQuery(
        "verifyAccessToken",
        {
            key: cacheKeys.accessToken(accessToken),
            ttl: (row: VerifyJwt) => 
                row.status === "VALID" && row.payload.exp
                    ? Math.min(ttlUntil(new Date(row.payload.exp * 1000)), 300)
                    : 0,
        },
        async () => 
            await verifyAccessToken(
                accessToken
            )
    )

    if (payload.status !== "VALID") throw new AppError(`Token ${payload.status === "EXPIRED" ? "Expired" : "Invalid"}`, 401);
    if (!payload.valid) throw new AppError("Invalid Token", 401);
    const id = payload.payload.userId;
    const user = await cachedQuery(
        "findUserById",
        { key: cacheKeys.user(id), ttl: 600 },
        () => 
            prisma.user.findUnique({
                where: {
                    id,
                }
            })
    )
    if (!user) throw new AppError("User Not Found", 404);
    if (user.banStatus === "BANNED") throw new AppError("User is banned", 403);
    
    return { user };
})
.as("scoped")