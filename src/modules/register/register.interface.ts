import { Member, Role, User } from "../../../.prisma/client";
import { CreateMemberInputType, DeleteMemberInputType, GetRegisterInputType, RoleChangeInputType, StatusChangeInputType, UpdateMemberInputType } from "./register.schema";

export interface IRegisterRepository {
    getRegisteration(data: GetRegisterInputType): Promise<Member[]>;
    getRegisterationById({ id }: { id: string }): Promise<Member | null>;
    getRoleByEventIdAdnUserId({ eventId, userId }: { eventId: string, userId: string }): Promise<{ role: Role } | null>;
    registerMember(data: CreateMemberInputType, user: User): Promise<Member>;
    deleteMember(data: DeleteMemberInputType): Promise<Member>;
    updateMember(data: UpdateMemberInputType): Promise<Member>;
    roleChange(data: RoleChangeInputType): Promise<Member>;
    statusChange(data: StatusChangeInputType): Promise<Member>;
}