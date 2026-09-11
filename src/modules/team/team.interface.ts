import { Team } from "../../../.prisma/client";
import { Role } from "../../../.prisma/enums";
import { GetTeamInputType } from "./team.schema";

export interface ITeamRepository {
    getTeam(data: GetTeamInputType): Promise<Team[] | null>;
    getTeamByEventIdAndUserId(eventId: string, userId: string): Promise<{ role: Role } | null>;
    getTeamByTeamIdAndUserId(teamId: string, userId: string): Promise<{ role: Role } | null>;
}