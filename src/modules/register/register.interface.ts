import { Member, Role } from "../../../.prisma/client";
import { GetRegisterInputType } from "./register.schema";

export interface IRegisterRepository {
    getRegisteration(data: GetRegisterInputType): Promise<Member[]>;
    getRegisterationById({ id }: { id: string }): Promise<Member | null>;
    getRoleByEventIdAdnUserId({ eventId, userId }: { eventId: string, userId: string }): Promise<{ role: Role } | null> 
}