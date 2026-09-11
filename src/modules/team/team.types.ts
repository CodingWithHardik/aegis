import { Role } from "../../../.prisma/enums";

export type TeamResponseType = {
    id: string;
    name: string;
    about: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export type TeamUserRole = {
    isSuperAdmin: boolean;
    role: Role;
}