import { refreshToken, User } from "../../../.prisma/client";
import { prisma } from "../../lib/prisma"
import { measureQuery } from "../../utils/common/helpers/MeasureQuery"
import { IAuthRepository } from "./auth.interface"
import { RefreshTokenType, RegisterUserType } from "./auth.types";

export class AuthRepository implements IAuthRepository {
    async findUserByEmail(email: string): Promise<User | null> {
        return measureQuery("findUserByEmail", () => 
            prisma.user.findUnique({
                where: {
                    email,
                }
            }),
        )
    }

    async findUserById(id: string): Promise<User | null> {
        return measureQuery("findUserById", () => 
            prisma.user.findUnique({
                where: {
                    id,
                }
            })
        )
    }

    async createUser(data: RegisterUserType): Promise<User> {
        return measureQuery("createUser", () =>
            prisma.user.create({
                data,
            }),
        )
    }

    async createRefreshToken(data: RefreshTokenType): Promise<refreshToken> {
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