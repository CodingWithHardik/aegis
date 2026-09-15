import Elysia from "elysia";
import { CommitteeController } from "./committee.controller";
import { authMiddleware } from "../../middleware/authentication.middleware";
import { createCommitteeSchema, deleteCommitteeSchema, getCommitteeSchema, updateCommitteeSchema } from "./committee.schema";
import { AuthSingleton } from "../../types/singleton";
import { validated } from "../../utils/common/validation/validated";

const router = new Elysia({ prefix: "/committee" });

const committeeController = new CommitteeController();

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/",
            ...validated<typeof getCommitteeSchema, AuthSingleton>(
                getCommitteeSchema,
                committeeController.getCommittee,
                { tags: ["Committee"], summary: "Get a specific committee" }
            )
        )
        .post("/create", 
            ...validated<typeof createCommitteeSchema, AuthSingleton>(
                createCommitteeSchema,
                committeeController.createCommittee,
                { tags: ["Committee"], summary: "Create a new committee" }
            )
        )
        .post("/update", 
            ...validated<typeof updateCommitteeSchema, AuthSingleton>(
                updateCommitteeSchema,
                committeeController.updateCommittee,
                { tags: ["Committee"], summary: "Update a specific committee" }
            )
        )
        .post("/delete", 
            ...validated<typeof deleteCommitteeSchema, AuthSingleton>(
                deleteCommitteeSchema,
                committeeController.deleteCommittee,
                { tags: ["Committee"], summary: "Delete a specific committee" }
            )
        )
)

export default router;