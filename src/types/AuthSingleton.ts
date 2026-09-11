import { User } from "../../.prisma/client";

export type AuthSingleton = {
    decorator: { user: User };
    store: {};
    derive: {};
    resolve: {};
}