import Elysia from "elysia";
import { TeamController } from "./team.controller";
import { authMiddleware } from "../../middleware/authentication.middleware";
import { getTeamSchema } from "./team.schema";
import { AuthSingleton } from "../../types/AuthSingleton";
import { validated } from "../../utils/common/validation/validated";

const router = new Elysia({ prefix: "/team" })

const teamController = new TeamController();

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/members", 
            ...validated<typeof getTeamSchema, AuthSingleton>(
                getTeamSchema,
                teamController.getTeam,
            )
        )
)

export default router;