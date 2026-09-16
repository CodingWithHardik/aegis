import Elysia from "elysia";
import { RegisterController } from "./register.controller";
import { authMiddleware } from "../../middleware/authentication.middleware";
import { AuthSingleton } from "../../types/singleton";
import { createMemberSchema, getRegisterSchema } from "./register.schema";
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

export default router;
