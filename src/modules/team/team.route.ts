import Elysia from "elysia";
import { TeamController } from "./team.controller";
import { authMiddleware } from "../../middleware/authentication.middleware";
import { addMemberSchema, getTeamSchema } from "./team.schema";
import { AuthSingleton } from "../../types/singleton";
import { validated } from "../../utils/common/validation/validated";

const router = new Elysia({ prefix: "/team" })

const teamController = new TeamController();

router.use(
    new Elysia({ prefix: "/member" })
        .use(authMiddleware)
        .post("/", 
            ...validated<typeof getTeamSchema, AuthSingleton>(
                getTeamSchema,
                teamController.getTeam,
            )
        )
        .post("/add", 
            ...validated<typeof addMemberSchema, AuthSingleton>(
                addMemberSchema,
                teamController.addMember,
            )
        )
)

export default router;