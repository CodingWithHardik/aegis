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
            )
        )
        .post("/create", 
            ...validated<typeof createCommitteeSchema, AuthSingleton>(
                createCommitteeSchema,
                committeeController.createCommittee,
            )
        )
        .post("/update", 
            ...validated<typeof updateCommitteeSchema, AuthSingleton>(
                updateCommitteeSchema,
                committeeController.updateCommittee,
            )
        )
        .post("/delete", 
            ...validated<typeof deleteCommitteeSchema, AuthSingleton>(
                deleteCommitteeSchema,
                committeeController.deleteCommittee,
            )
        )
)

export default router;