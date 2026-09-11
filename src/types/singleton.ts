import { SingletonBase } from "elysia";
import { User } from "../../.prisma/client";

export const emptySingleton: SingletonBase = {
    decorator: {},
    store: {},
    derive: {},
    resolve: {},
};

export type AuthSingleton = {
    decorator: { user: User };
    store: {};
    derive: {};
    resolve: {};
};