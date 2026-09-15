import Elysia from "elysia";
import { RegisterController } from "./register.controller";
import { authMiddleware } from "../../middleware/authentication.middleware";
import { AuthSingleton } from "../../types/singleton";
import { getRegisterSchema } from "./register.schema";
import { validated } from "../../utils/common/validation/validated";

const router = new Elysia({ prefix: "/register" });

const registerController = new RegisterController();

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/",
            ...validated<typeof getRegisterSchema, AuthSingleton>(
                getRegisterSchema,
                registerController.getRegisteration
            )
        )
)

