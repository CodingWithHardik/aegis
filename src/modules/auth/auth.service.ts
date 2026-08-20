import { logger } from "../../config/logger";
import { AppError } from "../../utils/common/Errors/AppError";
import { hashPassword, hashEmail, signAccessToken, signRefreshToken, comparePassword } from "./auth.helper";
import { IAuthRepository } from "./auth.interface";
import { toUserResponse } from "./auth.response";
import { LoginUserInputType, RegisterUserInputType } from "./auth.schema";

export class AuthService {
    constructor(private authRepo: IAuthRepository) {}

    async registerUserService(data: RegisterUserInputType) {
        const existingUser = await this.authRepo.findUserByEmail(data.email);

        if (existingUser) {
            throw new AppError("User already exists", 400);
        }

        const hashedPassword = await hashPassword(data.password);
        const hashedEmail = await hashEmail(data.email);

        const user = await this.authRepo.createUser({
            name: data.name,
            email: data.email,
            passwordHash: hashedPassword,
            emailHash: hashedEmail,
        });

        const accessToken = signAccessToken({
            userId: user.id,
            email: hashedPassword
        })

        const refreshToken = signRefreshToken({
            userId: user.id,
            email: hashedEmail
        })

        logger.info({
            event: "USER_REGISTERED",
            userId: user.id
        })

        return {
            user: toUserResponse(user),
            accessToken,
            refreshToken
        }
    }

    async loginUserService(data: LoginUserInputType) {
        const user = await this.authRepo.findUserByEmail(data.email);

        if (!user) {
            throw new AppError("Invalid Credentials", 401)
        }

        if (!user.passwordHash) {
            throw new AppError("Invalid Credentials", 401)
        }

        const verifyPassword = await comparePassword(
            data.password,
            user.passwordHash
        )

        if (!verifyPassword) {
            throw new AppError("Invalid Credentials", 401)
        };

        const accessToken = signAccessToken({
            userId: user.id,
            email: user.passwordHash
        })

        const refreshToken = signRefreshToken({
            userId: user.id,
            email: user.passwordHash
        })

        logger.info({
            event: "USER_LOGGED",
            userId: user.id,
        })

        return {
            user: toUserResponse(user),
            accessToken,
            refreshToken,
        }
    }

    async getLoggedInUserDetails(userId: string) {
        const user = await this.authRepo.findUserById(userId);

        if (!user) {
            throw new AppError("User Not Found", 404);
        }

        return toUserResponse(user)
    }
}