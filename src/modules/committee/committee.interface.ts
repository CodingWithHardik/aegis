import { Committee, Role } from "../../../.prisma/client";
import { CreateCommitteeInputType, DeleteCommitteeInputType, GetCommitteeInputType, UpdateCommitteeInputType } from "./committee.schema";

export interface ICommitteeRepository {
    getCommittee(data: GetCommitteeInputType): Promise<Committee[]>;

    getEventByCommitteeId(committeeId: string): Promise<Committee | null>;

    getRoleByEventIdAndUserId(eventId: string, userId: string): Promise<{ role: Role } | null>;

    createCommittee(data: CreateCommitteeInputType): Promise<Committee>;

    updateCommittee(data: UpdateCommitteeInputType): Promise<Committee>;
    
    deleteCommittee(data: DeleteCommitteeInputType): Promise<Committee>;
}