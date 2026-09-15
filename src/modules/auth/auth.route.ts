import Elysia from "elysia";
import { AuthController } from "./auth.controller";
import { loginUserSchema, refreshAccessTokenSchema, registerUserSchema, updateUserSchema } from "./auth.schema";
import { authMiddleware } from "../../middleware/authentication.middleware";
import { validated } from "../../utils/common/validation/validated";
import { loginRateLimit } from "../../middleware/rate-limit/login-rate-limit.middleware"

const router = new Elysia({ prefix: "/auth" });

const authController = new AuthController();

router
    .post("/register", 
        ...validated(
            registerUserSchema, 
            authController.registerUser
        )
    );

router
    .use(
        new Elysia()
            .use(loginRateLimit)
            .post("/login", 
                ...validated(
                    loginUserSchema, 
                    authController.loginUser
                )
            )
    )

router
    .use(
        new Elysia()
            .use(authMiddleware)
            .get("/me",
                authController.getLoggedInUser
            )
    )

router.use(
    new Elysia()
        .post("/refresh", 
            ...validated(
                refreshAccessTokenSchema, 
                authController.refreshAccessToken
            )
        )
)

router.use(
    new Elysia()
        .post("/update", 
            ...validated(
                updateUserSchema,
                authController.updateUser
            )
        )
)

export default router;