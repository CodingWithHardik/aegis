import { User } from "../../../.prisma/client";
import { AppError } from "../../utils/common/Errors/AppError";
import { ICommitteeRepository } from "./committee.interface";
import { toCommitteeGetResponse, toCommitteeResponse } from "./committee.response";
import { CreateCommitteeInputType, DeleteCommitteeInputType, GetCommitteeInputType, UpdateCommitteeInputType } from "./committee.schema";

export class CommitteeService {
    constructor(private committeeRepo: ICommitteeRepository) {};

    async getCommitteeService(data: GetCommitteeInputType, user: User) {
        const isSuperAdmin = user.isSuperAdmin;
        if (!isSuperAdmin) {
            if (!data.eventId && !data.committeeId)
                return toCommitteeGetResponse([]);
            const targetCommittee = data.committeeId ?
                await this.committeeRepo.getEventByCommitteeId(data.committeeId) :
                null;
            if (data.committeeId && !targetCommittee) 
                return toCommitteeGetResponse([]);
            const userRole = await this.committeeRepo.getRoleByEventIdAndUserId(data.committeeId ? targetCommittee!.eventId : data.eventId!, user.id);
            if (!userRole) return toCommitteeGetResponse([]);
        }

        const result = await this.committeeRepo.getCommittee(data) ?? [];
        return toCommitteeGetResponse(result);
    }

    async createCommittee(data: CreateCommitteeInputType, user: User) {
        const isSuperAdmin = user.isSuperAdmin;
        if (!isSuperAdmin) {
            const userRole = await this.committeeRepo.getRoleByEventIdAndUserId(data.eventId, user.id);
            if (!userRole) 
                throw new AppError("Unauthorized", 403);
            if (userRole.role !== "SUPER_ADMIN" && userRole.role !== "ADMIN")
                throw new AppError("Unauthorized", 403);
        }

        const result = await this.committeeRepo.createCommittee(data);

        return toCommitteeResponse(result);
    }

    async updateCommittee(data: UpdateCommitteeInputType, user: User) {
        const isSuperAdmin = user.isSuperAdmin;
        if (!isSuperAdmin) {
            const committee = await this.committeeRepo.getEventByCommitteeId(data.committeeId);
            if (!committee)
                throw new AppError("Unauthorized", 403);
            const userRole = await this.committeeRepo.getRoleByEventIdAndUserId(committee.eventId, user.id);
            if (!userRole)
                throw new AppError("Unauthorized", 403);
            if (userRole.role !== "SUPER_ADMIN" && userRole.role !== "ADMIN")
                throw new AppError("Unauthorized", 403);
        }

        const result = await this.committeeRepo.updateCommittee(data);

        return toCommitteeResponse(result);
    }

    async deleteCommittee(data: DeleteCommitteeInputType, user: User) {
        const isSuperAdmin = user.isSuperAdmin;
        if (!isSuperAdmin) {
            const committee = await this.committeeRepo.getEventByCommitteeId(data.committeeId);
            if (!committee)
                throw new AppError("Unauthorized", 403);
            const userRole = await this.committeeRepo.getRoleByEventIdAndUserId(committee.eventId, user.id);
            if (!userRole)
                throw new AppError("Unauthorized", 403);
            if (userRole.role !== "SUPER_ADMIN" && userRole.role !== "ADMIN")
                throw new AppError("Unauthorized", 403);
        }

        const result = await this.committeeRepo.deleteCommittee(data);

        return toCommitteeResponse(result);
    }
}