import bcrypt from "bcrypt";
import { env } from "../../config/env.config";
import { JwtPayloadType, VerifyJwt } from "./auth.types";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import type { Cookie } from "elysia";
import { measureOperation } from "../../utils/common/helpers/MeasureOperation";
import ms from "ms";
import crypto from "crypto";
import type { refreshToken } from "../../../.prisma/client";

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

export const generateFamilyId = (): string => {
    return crypto.randomBytes(16).toString("hex");
}

export const rawRefreshToken = (): string =>  
    crypto.randomBytes(48).toString("base64url");

export const generateRefreshToken = (token: string, familyId: string): string =>
    `${token}.${familyId}`;

export const hashRefreshToken = (token: string): string => 
    crypto.createHash("sha256").update(token).digest("hex");

export const verifyAccessToken = (token: string): VerifyJwt => {
    try {
        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
        if (typeof decoded === null || typeof decoded === "string") return { valid: false, status: "INVALID" };
        return { valid: true, payload: decoded, status: "VALID" };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET, { 
                ignoreExpiration: true 
            }) as JwtPayload;
            if (typeof payload === null || typeof payload === "string") return { valid: false, status: "INVALID" };
            return { valid: false, payload, status: "EXPIRED" };
        }
        return { valid: false, status: "INVALID" };
    }
}

export const verifyRefreshToken = async <T extends refreshToken>(raw: string, userId: string, familyId: string, query: (token: string) => Promise<T | null>): Promise<boolean> => {
    const token = hashRefreshToken(raw);
    const result: T | null = await query(token);
    
    if (!result) return false;
    if (result.status !== "ACTIVE") return false;
    if (result.familyId !== familyId) return false;
    if (result.userId !== userId) return false;
    
    return result.expiresAt > new Date();
}

export const setAuthCookies = (cookie: Record<string, Cookie<string | unknown>>, refreshToken: string) => {
    const refreshToeknAge = ms(env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue);

    cookie["refreshToken"].set({
        value: refreshToken,
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: refreshToeknAge,
    })
}

export const clearAuthCookies = (cookie: Record<string, Cookie<string | unknown>>) => {
    cookie["refreshToken"].remove();
}

const UNITS: Record<string, number> = {
    ms: 1, msec: 1, millisecond: 1, milliseconds: 1,
    s: 1e3, sec: 1e3, secs: 1e3, second: 1e3, seconds: 1e3,
    m: 6e4, min: 6e4, mins: 6e4, minute: 6e4, minutes: 6e4,
    h: 36e5, hr: 36e5, hrs: 36e5, hour: 36e5, hours: 36e5,
    d: 864e5, day: 864e5, days: 864e5,
    w: 6048e5, wk: 6048e5, week: 6048e5, weeks: 6048e5,
    y: 315576e5, yr: 315576e5, year: 315576e5, years: 315576e5,
}

export const addDuration = (input: string, base = new Date()) => {
    const re = /(-?\d+(?:\.\d+)?)\s*([a-z]+)/gi;
    let ms = 0, found = false, m;
    while ((m = re.exec(input))) {
        const mult = UNITS[m[2].toLowerCase()];
        if (mult == null) throw new Error(`Invalid time unit ${m[2]}`);
        ms += parseFloat(m[1]) * mult;
        found = true;
    }
    if (!found) throw new Error(`Invalid duration ${input}`);
    return new Date(base.getTime() + ms);
}