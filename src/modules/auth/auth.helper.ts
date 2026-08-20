import bcrypt from "bcrypt";
import { env } from "../../config/env.config";
import { JwtPayloadType } from "./auth.types";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import type { Cookie } from "elysia";
import { measureOperation } from "../../utils/common/helpers/MeasureOperation";
import ms from "ms";

const saltRounds = Number(env?.SALT_ROUNDS);

export const hashPassword = async (password: string) => {
    return measureOperation("bcrypt.hash", () => 
        bcrypt.hash(password, saltRounds)
    )
}

export const hashEmail = async (email: string) => {
    return measureOperation("email.hash", async () => {
        const data = new TextEncoder().encode(email.trim().toLowerCase());
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);

        return Array.from(new Uint8Array(hashBuffer))
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");
    })
}

export const comparePassword = async (
    password: string,
    hashedPassword: string,
) => {
    return measureOperation("bcrypt.compare", () => 
        bcrypt.compare(password, hashedPassword)
    );
};

export const signAccessToken = (payload: JwtPayloadType) => {
    return jwt.sign(payload, env?.ACCESS_TOKEN_SECRET!, {
        expiresIn: env?.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    }) 
}

export const signRefreshToken = (payload: JwtPayloadType) => {
    return jwt.sign(payload, env?.REFRESH_TOKEN_SECRET!, {
         expiresIn: env?.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    })
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, env?.ACCESS_TOKEN_SECRET!) as JwtPayload;
}

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, env?.REFRESH_TOKEN_SECRET!) as JwtPayload;
}

export const setAuthCookies = (cookie: Record<string, Cookie<string | unknown>>, refreshToken: string) => {
    const refreshToeknAge = ms(env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue);

    cookie["refreshToken"].set({
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: refreshToeknAge,
    })
}

export const clearAuthCookies = (cookie: Record<string, Cookie<string | unknown>>) => {
    cookie["refreshToken"].remove();
}