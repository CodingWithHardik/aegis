import { env } from "../../config/env.config";
import { logger } from "../../config/logger";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/common/Errors/AppError";
import { cachedQuery, invalidate } from "../../utils/common/helpers/CacheQuery";
import { ttlUntil } from "../../utils/common/helpers/helper.cache";
import { measureQuery } from "../../utils/common/helpers/MeasureQuery";
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import {
  hashPassword,
  hashEmail,
  signAccessToken,
  generateRefreshToken,
  comparePassword,
  addDuration,
  hashRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
  generateFamilyId,
  rawRefreshToken,
} from "./auth.helper";
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

    const familyId = generateFamilyId();

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      fId: familyId,
    });
    const rawToken = rawRefreshToken();
    const refreshToken = generateRefreshToken(rawToken, familyId);

    await this.authRepo.createRefreshToken({
      userId: user.id,
      token: hashRefreshToken(rawToken),
      expiry: addDuration(env.REFRESH_TOKEN_EXPIRES_IN),
      familyId: familyId,
    });

    logger.info({
      event: "USER_REGISTERED",
      userId: user.id,
    });

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  async loginUserService(data: LoginUserInputType) {
    const user = await this.authRepo.findUserByEmail(data.email);

    if (!user) {
      throw new AppError("Invalid Credentials", 401);
    }

    if (!user.passwordHash) {
      throw new AppError("Invalid Credentials", 401);
    }

    const verifyPassword = await comparePassword(
      data.password,
      user.passwordHash,
    );

    if (!verifyPassword) {
      throw new AppError("Invalid Credentials", 401);
    }

    const familyId = generateFamilyId();

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      fId: familyId,
    });

    const rawToken = rawRefreshToken();
    const refreshToken = generateRefreshToken(rawToken, familyId);

    await this.authRepo.createRefreshToken({
      userId: user.id,
      token: hashRefreshToken(rawToken),
      expiry: addDuration(env.REFRESH_TOKEN_EXPIRES_IN),
      familyId: familyId,
    });

    logger.info({
      event: "USER_LOGGED",
      userId: user.id,
    });

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  async getLoggedInUserDetails(userId: string) {
    const user = await this.authRepo.findUserById(userId);

    if (!user) {
      throw new AppError("User Not Found", 404);
    }

    return toUserResponse(user);
  }

  async refreshAccessTokenService(
    refreshToken: string,
    userId: string,
    authToken: string,
  ) {
    const VerifyAccessToken = verifyAccessToken(authToken);

    if (
      VerifyAccessToken.status === "VALID" ||
      VerifyAccessToken.status === "INVALID"
    ) {
      throw new AppError(
        VerifyAccessToken.status === "VALID"
          ? "Access Token Not Expired"
          : "Invalid Access Token",
        401,
      );
    }
    if (VerifyAccessToken.payload.userId !== userId) {
      throw new AppError("Invalid Access Token", 401);
    }
    const AccessTokenfamilyId = VerifyAccessToken.payload.fId;
    const RefreshTokenfamilyId = refreshToken.split(".")[1];
    if (AccessTokenfamilyId !== RefreshTokenfamilyId) {
      throw new AppError("Invalid Access Token", 401);
    }
    const refreshTokenRecord = refreshToken.split(".")[0];
    const verifiedToken = await verifyRefreshToken(
      refreshTokenRecord,
      userId,
      RefreshTokenfamilyId,
      async (token) =>
        await cachedQuery(
          "findRefreshToken",
          {
            key: cacheKeys.refreshToken(token),
            ttl: (row) => Math.min(ttlUntil(row.expiresAt), 600),
          },
          () =>
            prisma.refreshToken.findUnique({
              where: {
                token,
                userId,
                status: "ACTIVE",
                familyId: RefreshTokenfamilyId,
              },
            }),
        ),
    );

    if (!verifiedToken) {
      throw new AppError("Invalid Refresh Token", 401);
    }

    const user = await this.authRepo.findUserById(userId);

    if (!user) {
      throw new AppError("Invalid User", 401);
    }

    measureQuery("markRefreshTokenUsed", () =>
      prisma.refreshToken.update({
        where: {
          token: hashRefreshToken(refreshTokenRecord),
          userId: userId,
          status: "ACTIVE",
        },
        data: {
          status: "ROTATED",
        },
      }),
    );

    const familyId = generateFamilyId();

    const accessToken = signAccessToken({
      userId: userId,
      email: user.email,
      fId: familyId,
    });

    const rawToken = rawRefreshToken();
    const refreshTokenNew = generateRefreshToken(rawToken, familyId);

    await this.authRepo.createRefreshToken({
      userId: userId,
      token: hashRefreshToken(rawToken),
      expiry: addDuration(env.REFRESH_TOKEN_EXPIRES_IN),
      familyId: familyId,
    });

    await invalidate(
      cacheKeys.refreshToken(hashRefreshToken(refreshTokenRecord)),
      cacheKeys.refreshToken(hashRefreshToken(rawToken)),
    );

    logger.info({
      event: "TOKEN_REFRESHED",
      userId: userId,
    });

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken: refreshTokenNew,
    };
  }
}
