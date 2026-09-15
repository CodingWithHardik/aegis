import { User, refreshToken } from "../../../.prisma/client";
import { UpdateUserInputType } from "./auth.schema";
import { RefreshTokenType, RegisterUserType } from "./auth.types";

export interface IAuthRepository {
    findUserById(id: string): Promise<User | null>;

    findUserByEmail(email: string): Promise<User | null>;

    createUser(data: RegisterUserType): Promise<User>;

    createRefreshToken(data: RefreshTokenType): Promise<refreshToken>;

    updateUser(data: UpdateUserInputType, userId: string): Promise<User>;
}