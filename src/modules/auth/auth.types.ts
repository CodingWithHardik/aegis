import type { Context } from "elysia";

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

export type JwtPayloadType = {
    userId: string;
    email: string;
}

export type AuthUser = {
    userId: string;
};

export type AuthContext = Context & {
    user: AuthUser;
}