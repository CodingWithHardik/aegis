import { Team } from "../../../.prisma/client";
import { AddMemberInputType, DeleteMemberInputType, GetTeamInputType, UpdateMemberInputType } from "./team.schema";

export interface ITeamRepository {
    getTeam(data: GetTeamInputType): Promise<Team[] | null>;
    getTeamByEventIdAndUserId(eventId: string, userId: string): Promise<Team | null>;
    getTeamByTeamIdAndUserId(teamId: string, userId: string): Promise<Team | null>;
    createTeam(data: AddMemberInputType): Promise<Team>;
    updateTeam(data: UpdateMemberInputType): Promise<Team>;
    deleteTeam(data: DeleteMemberInputType): Promise<Team>;
}