import Elysia from "elysia";
import { RegisterController } from "./register.controller";
import { authMiddleware } from "../../middleware/authentication.middleware";
import { AuthSingleton } from "../../types/singleton";
import { createMemberSchema, deleteMemberSchema, getRegisterSchema, roleChangeSchema, updateMemberSchema } from "./register.schema";
import { validated } from "../../utils/common/validation/validated";

const router = new Elysia({ prefix: "/register" });

const registerController = new RegisterController();

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/",
            ...validated<typeof getRegisterSchema, AuthSingleton>(
                getRegisterSchema,
                registerController.getRegisteration,
                { tags: ["Register"], summary: "Get a specific registeration" }
            )
        )
)

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/register",
            ...validated<typeof createMemberSchema, AuthSingleton>(
                createMemberSchema,
                registerController.registerMember,
                { tags: ["Register"], summary: "Do registeration of a user"}
            )
        )
)

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/update",
            ...validated<typeof updateMemberSchema, AuthSingleton>(
                updateMemberSchema,
                registerController.updateMember,
                { tags: ["Register"], summary: "Update a member"}
            )
        )
)

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/delete",
            ...validated<typeof deleteMemberSchema, AuthSingleton>(
                deleteMemberSchema,
                registerController.deleteMember,
                { tags: ["Register"], summary: "Remove a member"}
            )
        )
)

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/role-change",
            ...validated<typeof roleChangeSchema, AuthSingleton>(
                roleChangeSchema,
                registerController.roleChange,
                { tags: ["Register"], summary: "Change role of a member"}
            )
        )
)

export default router;
