import { User } from "../../../.prisma/client";
import { AppError } from "../../middleware/error.middleware";
import { IRegisterRepository } from "./register.interface";
import { toRegisterGetResponse, toRegisterResponse } from "./register.response";
import { CreateMemberInputType, DeleteMemberInputType, GetRegisterInputType, PaymentChangeInputType, RoleChangeInputType, StatusChangeInputType, UpdateMemberInputType } from "./register.schema";

export class RegisterService {
    constructor(private registerRepo: IRegisterRepository) {};

    async getRegisteration(data: GetRegisterInputType, user: User) {
        if (!user.isSuperAdmin) {
            if (!data.eventId && !data.id) 
                throw new AppError("EventId or RegisterationId is required", 400);
            const eventIdByRegisteration = data.id ?
                await this.registerRepo.getRegisterationById({ id: data.id }) : null;
            if (!eventIdByRegisteration && data.id) 
                throw new AppError("Unauthorized", 403)
            const eventId = eventIdByRegisteration ? eventIdByRegisteration.eventId : data.eventId;
            if (!eventId)
                throw new AppError("EventId is required", 400);
            const getRole = await this.registerRepo.getRoleByEventIdAdnUserId({ eventId: eventId, userId: user.id })
            if (!getRole)
                throw new AppError("Unauthorized", 403);
        }

        const result = await this.registerRepo.getRegisteration(data) ?? [];

        return toRegisterGetResponse(result);
    }

    async registerMember(data: CreateMemberInputType, user: User) {
        const result = await this.registerRepo.registerMember(data, user);

        return toRegisterResponse(result);
    }

    async deleteMember(data: DeleteMemberInputType, user: User) {
        if (!user.isSuperAdmin) {
            const eventIdByRegisteration = data.memberId ?
                await this.registerRepo.getRegisterationById({ id: data.memberId }) : null;
            if (!eventIdByRegisteration && data.memberId) 
                throw new AppError("Unauthorized", 403)
            const eventId = eventIdByRegisteration ? eventIdByRegisteration.eventId : data.eventId;
            if (!eventId)
                throw new AppError("EventId is required", 400);
            const getRole = await this.registerRepo.getRoleByEventIdAdnUserId({ eventId: eventId, userId: user.id })
            if (!getRole)
                throw new AppError("Unauthorized", 403);
            if (
                getRole.role !== "SUPER_ADMIN" && 
                getRole.role !== "ADMIN" && 
                getRole.role !== "DELEGATE_AFFAIRS" &&
                getRole.role !== "FINANCE_MANAGER"
            ) 
                throw new AppError("Unauthorized", 403);
        }
        const result = await this.registerRepo.deleteMember(data);
        
        return toRegisterResponse(result);
    }

    async updateMember(data: UpdateMemberInputType, user: User) {
        if (!user.isSuperAdmin) {
            const eventIdByRegisteration = data.memberId ?
                await this.registerRepo.getRegisterationById({ id: data.memberId }) : null;
            if (!eventIdByRegisteration && data.memberId) 
                throw new AppError("Unauthorized", 403)
            const eventId = eventIdByRegisteration ? eventIdByRegisteration.eventId : data.eventId;
            if (!eventId)
                throw new AppError("EventId is required", 400);
            const getRole = await this.registerRepo.getRoleByEventIdAdnUserId({ eventId: eventId, userId: user.id })
            if (!getRole)
                throw new AppError("Unauthorized", 403);
        }
        const result = await this.registerRepo.updateMember(data);
        
        return toRegisterResponse(result);
    }

    async roleChange(data: RoleChangeInputType, user: User) {
        if (!user.isSuperAdmin) {
            const eventIdByRegisteration = data.memberId ?
                await this.registerRepo.getRegisterationById({ id: data.memberId }) : null;
            if (!eventIdByRegisteration && data.memberId) 
                throw new AppError("Unauthorized", 403)
            const eventId = eventIdByRegisteration ? eventIdByRegisteration.eventId : data.eventId;
            if (!eventId)
                throw new AppError("EventId is required", 400);
            const getRole = await this.registerRepo.getRoleByEventIdAdnUserId({ eventId: eventId, userId: user.id })
            if (!getRole)
                throw new AppError("Unauthorized", 403);
        }

        const result = await this.registerRepo.roleChange(data);

        return toRegisterResponse(result);
    }
    
    async statusChange(data: StatusChangeInputType, user: User) {
        if (!user.isSuperAdmin) {
            const eventIdByRegisteration = data.memberId ?
                await this.registerRepo.getRegisterationById({ id: data.memberId }) : null;
            if (!eventIdByRegisteration && data.memberId) 
                throw new AppError("Unauthorized", 403)
            const eventId = eventIdByRegisteration ? eventIdByRegisteration.eventId : data.eventId;
            if (!eventId)
                throw new AppError("EventId is required", 400);
            const getRole = await this.registerRepo.getRoleByEventIdAdnUserId({ eventId: eventId, userId: user.id })
            if (!getRole)
                throw new AppError("Unauthorized", 403);
            if (
                getRole.role !== "SUPER_ADMIN" &&
                getRole.role !== "ADMIN"
            )
                throw new AppError("Unauthorized", 403)
        }

        const result = await this.registerRepo.statusChange(data);

        return toRegisterResponse(result);
    }

    async paymentStatusChange(data: PaymentChangeInputType, user: User) {
        if (!user.isSuperAdmin) {
            const eventIdByRegisteration = data.memberId ?
                await this.registerRepo.getRegisterationById({ id: data.memberId }) : null;
            if (!eventIdByRegisteration && data.memberId) 
                throw new AppError("Unauthorized", 403)
            const eventId = eventIdByRegisteration ? eventIdByRegisteration.eventId : data.eventId;
            if (!eventId)
                throw new AppError("EventId is required", 400);
            const getRole = await this.registerRepo.getRoleByEventIdAdnUserId({ eventId: eventId, userId: user.id })
            if (!getRole)
                throw new AppError("Unauthorized", 403);
            if (
                getRole.role !== "SUPER_ADMIN" &&
                getRole.role !== "ADMIN" &&
                getRole.role !== "FINANCE_MANAGER"
            )
                throw new AppError("Unauthorized", 403)
        }

        const result = await this.registerRepo.paymentModeChange(data);
        
        return toRegisterResponse(result);
    }
}