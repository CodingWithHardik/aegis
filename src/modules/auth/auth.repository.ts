import { refreshToken, User } from "../../../.prisma/client";
import { prisma } from "../../lib/prisma"
import { cachedQuery, invalidate } from "../../utils/common/helpers/CacheQuery";
import { measureQuery } from "../../utils/common/helpers/MeasureQuery"
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import { IAuthRepository } from "./auth.interface"
import { RefreshTokenType, RegisterUserType } from "./auth.types";

export class AuthRepository implements IAuthRepository {
    async findUserByEmail(email: string): Promise<User | null> {
        return cachedQuery(
            "findUserByEmail",
            { key: cacheKeys.userByEmail(email), ttl: 600 },
            () => 
                prisma.user.findUnique({
                    where: {
                        email,
                    }
                })
        )
    }

    async findUserById(id: string): Promise<User | null> {
        return cachedQuery(
            "findUserById",
            { key: cacheKeys.user(id), ttl: 600 },
            () => 
            prisma.user.findUnique({
                where: {
                    id,
                }
            })
        )
    }

    async createUser(data: RegisterUserType): Promise<User> {
        await invalidate(cacheKeys.userByEmail(data.email));
        return measureQuery("createUser", () =>
            prisma.user.create({
                data,
            }),
        )
    }

    async createRefreshToken(data: RefreshTokenType): Promise<refreshToken> {
        await invalidate(cacheKeys.refreshToken(data.token));
        return measureQuery("createRefreshToken", () => 
            prisma.refreshToken.create({
                data: {
                    token: data.token,
                    expiresAt: new Date(data.expiry),
                    familyId: data.familyId,
                    user: {
                        connect: {
                            id: data.userId,
                        }
                    }
                }
            })
        )
    }
}