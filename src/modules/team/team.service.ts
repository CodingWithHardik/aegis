import { User } from "../../../.prisma/client";
import { logger } from "../../config/logger";
import { AppError } from "../../middleware/error.middleware";
import { filterGetTeam, getRoleOfUser } from "./team.helper";
import { ITeamRepository } from "./team.interface";
import { toTeamGetResponse } from "./team.response";
import { GetTeamInputType } from "./team.schema";

export class TeamService {
    constructor(private teamRepo: ITeamRepository) {}

    async getTeam(data: GetTeamInputType, user: User) {
        if (!user.isSuperAdmin) {
            if (!data.eventId && !data.teamId) throw new AppError("EventId or TeamId is required", 400);
            
            const getUserRole = await getRoleOfUser(
                this.teamRepo.getTeamByEventIdAndUserId,
                this.teamRepo.getTeamByTeamIdAndUserId,
                data,
                user
            )

            if (!getUserRole) return toTeamGetResponse([]);

            if (getUserRole.role !== "SUPER_ADMIN" && getUserRole.role !== "ADMIN")
                data.userId = user.id;
        }
    
        const result = await this.teamRepo.getTeam(data) ?? [];

        const filteredResult = filterGetTeam(result, data);

        logger.info({
            event: "TEAM_FETCHED",
            userId: user.id,
        })
        
        return toTeamGetResponse(filteredResult)
    }
}