import Elysia from "elysia";
import { TeamController } from "./team.controller";
import { authMiddleware } from "../../middleware/authentication.middleware";
import { addMemberSchema, deleteMemberSchema, getTeamSchema, updateMemberSchema } from "./team.schema";
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
                { tags: ["Team"], summary: "Get a specific team" }
            )
        )
        .post("/add", 
            ...validated<typeof addMemberSchema, AuthSingleton>(
                addMemberSchema,
                teamController.addMember,
                { tags: ["Team"], summary: "Add a new member to the team" }
            )
        )
        .post("/update",
            ...validated<typeof updateMemberSchema, AuthSingleton>(
                updateMemberSchema,
                teamController.updateMember,
                { tags: ["Team"], summary: "Update a specific member in the team" }
            )
        )
        .post("/delete",
            ...validated<typeof deleteMemberSchema, AuthSingleton>(
                deleteMemberSchema,
                teamController.deleteMember,
                { tags: ["Team"], summary: "Delete a specific member from the team" }
            )
        )
)

export default router;