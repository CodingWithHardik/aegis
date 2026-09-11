import { TeamRepository } from "./team.repository";
import { TeamService } from "./team.service";

const teamRepository = new TeamRepository();
const teamService = new TeamService(teamRepository);

export { teamService };