import { User } from "../../../.prisma/client";
import { RegisterUserType } from "./auth.types";

export interface IAuthRepository {
    findUserById(id: string): Promise<User | null>;

    findUserByEmail(email: string): Promise<User | null>;

    createUser(data: RegisterUserType): Promise<User>
}