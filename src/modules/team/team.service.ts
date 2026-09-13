import { User } from "../../../.prisma/client";
import { logger } from "../../config/logger";
import { AppError } from "../../middleware/error.middleware";
import { filterGetTeam, getRoleOfUser } from "./team.helper";
import { ITeamRepository } from "./team.interface";
import { toTeamGetResponse, toTeamResponse } from "./team.response";
import { AddMemberInputType, DeleteMemberInputType, GetTeamInputType, UpdateMemberInputType } from "./team.schema";

export class TeamService {
    constructor(private teamRepo: ITeamRepository) {}

    async getTeam(data: GetTeamInputType, user: User) {
        if (!user.isSuperAdmin) {
            if (!data.eventId && !data.teamId) throw new AppError("EventId or TeamId is required", 400);
            
            const getUserRole = await getRoleOfUser(
                this.teamRepo.getTeamByEventIdAndUserId,
                this.teamRepo.getTeamByTeamIdAndUserId,
                data,
                user,
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

    async addMember(data: AddMemberInputType, user: User) {
        if (!user.isSuperAdmin) {
            const getUserRole = await this.teamRepo.getTeamByEventIdAndUserId(data.eventId, user.id);
            if (!getUserRole) 
                throw new AppError("Unauthorized", 403);
            if (getUserRole.role !== "SUPER_ADMIN" && getUserRole.role !== "ADMIN") 
                throw new AppError("Unauthorized", 403);
            if (getUserRole.role === "ADMIN" && data.role === "SUPER_ADMIN")
                throw new AppError("Unauthorized", 403);
        }

        const result = await this.teamRepo.createTeam(
            data,
        );

        logger.info({
            event: "ADDED_MEMBER",
            userId: user.id,
            eventId: result.eventId,
            teamId: result.id,
        })

        return toTeamResponse(result)
    }

    async updateMember(data: UpdateMemberInputType, user: User) {
        if (!user.isSuperAdmin) {
            const getUserRole = await getRoleOfUser(
                this.teamRepo.getTeamByEventIdAndUserId,
                this.teamRepo.getTeamByTeamIdAndUserId,
                {
                    eventId: data.eventId,
                    teamId: data.teamId,
                    userId: data.userId,
                },
                user,
            )
            if (!getUserRole)
                throw new AppError("Unauthorized", 403);
            if (getUserRole.role !== "SUPER_ADMIN" && getUserRole.role !== "ADMIN")
                throw new AppError("Unauthorized", 403);
            if (data.role === "SUPER_ADMIN" && getUserRole.role !== "SUPER_ADMIN")
                throw new AppError("Unauthorized", 403);
            const getTargetUserRole = await getRoleOfUser(
                this.teamRepo.getTeamByEventIdAndUserId,
                this.teamRepo.getTeamByTeamIdAndUserId,
                {
                    eventId: data.eventId,
                    teamId: data.teamId,
                    userId: data.userId,
                },
                user,
                data.userId
            )
            if (getUserRole.role === "ADMIN" && getTargetUserRole?.role === "SUPER_ADMIN")
                throw new AppError("Unauthorized", 403);
        }

        const result = await this.teamRepo.updateTeam(
            data,
        )

        logger.info({
            event: "UPDATED_MEMBER",
            userId: user.id,
            eventId: result.eventId,
            teamId: result.id,
        })

        return toTeamResponse(result);
    }

    async deleteMember(data: DeleteMemberInputType, user: User) {
        if (!user.isSuperAdmin) {
            const getUserRole = await getRoleOfUser(
                this.teamRepo.getTeamByEventIdAndUserId,
                this.teamRepo.getTeamByTeamIdAndUserId,
                {
                    eventId: data.eventId,
                    teamId: data.teamId,
                    userId: data.userId,
                },
                user,
            )
            if (!getUserRole)
                throw new AppError("Unauthorized", 403);
            if (getUserRole.role !== "SUPER_ADMIN" && getUserRole.role !== "ADMIN")
                throw new AppError("Unauthorized", 403);
            const getTargetUserRole = await getRoleOfUser(
                this.teamRepo.getTeamByEventIdAndUserId,
                this.teamRepo.getTeamByTeamIdAndUserId,
                {
                    eventId: data.eventId,
                    teamId: data.teamId,
                    userId: data.userId,
                },
                user,
                data.userId
            )
            if (getUserRole.role === "ADMIN" && getTargetUserRole?.role === "SUPER_ADMIN")
                throw new AppError("Unauthorized", 403);
        }

        const result = await this.teamRepo.deleteTeam(
            data,
        )

        logger.info({
            event: "DELETE_MEMBER",
            userId: user.id,
            eventId: result.eventId,
            teamId: result.id,
        })

        return toTeamResponse(result);
    }
}