import type { Context } from "elysia";
import type { JwtPayload } from "jsonwebtoken";

export type UserResponseType = {
    id: string;
    name: string;
    email: string;
    emailHash: string | null;
    googleId: string | null;
    passwordHash: string | null;
    phoneNo: string | null;
    isSuperAdmin: boolean;
    banStatus: "BANNED" | "UNBANNED";
    createdAt: Date;
    updatedAt: Date;
}

export type RegisterUserType = {
    name: string;
    email: string;
    emailHash: string;
    passwordHash: string;
} | {
    name: string;
    email: string;
    googleId: string;
}

export type RefreshTokenType = {
    userId: string;
    token: string;
    expiry: Date;
    familyId: string;
}

export type JwtPayloadType = {
    userId: string;
    email: string;
    fId: string;
}

export type AuthUser = {
    id: string;
};

export type AuthContext = Context & {
    user: AuthUser;
}

export type VerifyJwt = 
    | { valid: true; payload: JwtPayload; status: "VALID" } 
    | { valid: false; status: "INVALID" }
    | { valid: false; payload: JwtPayload; status: "EXPIRED" };