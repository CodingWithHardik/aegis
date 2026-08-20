import { UserResponseType } from "./auth.types";

export const toUserResponse = (user: UserResponseType) => {
    return {
        name: user.name,
        email: user.email,
    }
}