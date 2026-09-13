import { Role, Team, User } from "../../../.prisma/client"
import { GetTeamInputType } from "./team.schema";

export const filterGetTeam = (teams: Team[], data: GetTeamInputType): Team[] => 
    teams.filter(
        (team) => 
            (data.eventId === undefined || team.eventId === data.eventId) &&
            (data.userId === undefined || team.userId === data.userId) &&
            (data.role === undefined || team.role === data.role) &&
            (data.teamId === undefined || team.id === data.teamId)
    )


export const getRoleOfUser = async (
    getTeamByEventIdAndUserId:(eventId: string, userId: string) => Promise<Team | null>, 
    getTeamByTeamIdAndUserId: (teamId: string, userId: string) => Promise<Team | null>, 
    data: GetTeamInputType, 
    user: User,
    bypassUserId: string | null = null,
): Promise<{ role: Role } | null> => {
    if (data.teamId) {
        const preresult = await getTeamByTeamIdAndUserId(data.teamId, bypassUserId ?? user.id);
        if (!preresult) return null;
        const result = await getTeamByEventIdAndUserId(data.teamId, bypassUserId ?? user.id);
        return result?.role ? { role: result.role } : null;
    } else if (data.eventId) {
        const result = await getTeamByEventIdAndUserId(data.eventId, bypassUserId ?? user.id);
        return result?.role ? { role: result.role } : null;
    } else
        return null;
}