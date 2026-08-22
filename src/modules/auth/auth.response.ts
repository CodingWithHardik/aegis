import { UserResponseType } from "./auth.types";

export const toUserResponse = (user: UserResponseType) => {
    return {
        userId: user.id,
        name: user.name,
        email: user.email,
    }
}