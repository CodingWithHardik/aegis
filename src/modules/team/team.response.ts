import { TeamResponseType } from "./team.types";

export const toTeamResponse = (team: TeamResponseType) => {
    return {
        id: team.id,
        name: team.name,
        ...(team.about !== null ? { about: team.about } : {}),
        role: team.role,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
    }
}

export const toTeamGetResponse = (team: TeamResponseType[]) => {
    return team.map(( team ) => toTeamResponse(team))
}