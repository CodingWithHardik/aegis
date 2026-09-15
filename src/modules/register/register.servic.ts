import { User } from "../../../.prisma/client";
import { AppError } from "../../middleware/error.middleware";
import { IRegisterRepository } from "./register.interface";
import { GetRegisterInputType } from "./register.schema";

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

        return result;
    }
}