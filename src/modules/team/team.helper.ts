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
    getTeamByTeamId: (teamId: string) => Promise<Team | null>, 
    data: GetTeamInputType, 
    user: User,
    bypassUserId: string | null = null,
): Promise<{ role: Role } | null> => {
    const targetUser = bypassUserId ?? user.id;
    if (data.teamId) {
        const preresult = await getTeamByTeamId(data.teamId);
        if (!preresult) return null;
        const result = await getTeamByEventIdAndUserId(preresult.eventId, targetUser);
        return result?.role ? { role: result.role } : null;
    } else if (data.eventId) {
        const result = await getTeamByEventIdAndUserId(data.eventId, targetUser);
        return result?.role ? { role: result.role } : null;
    } else
        return null;
}