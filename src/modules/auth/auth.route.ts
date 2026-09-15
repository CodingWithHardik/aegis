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
            authController.registerUser,
            { tags: ["Auth"], summary: "Register a new user" }
        )
    );

router
    .use(
        new Elysia()
            .use(loginRateLimit)
            .post("/login", 
                ...validated(
                    loginUserSchema, 
                    authController.loginUser,
                    { tags: ["Auth"], summary: "Log in, receive access/refresh tokens" }
                )
            )
    )

router
    .use(
        new Elysia()
            .use(authMiddleware)
            .get("/me",
                authController.getLoggedInUser,
                { detail: { tags: ["Auth"], summary: "Get logged in user details" }}
            )
    )

router.use(
    new Elysia()
        .post("/refresh", 
            ...validated(
                refreshAccessTokenSchema, 
                authController.refreshAccessToken,
                { tags: ["Auth"], summary: "Refresh access token using refresh token" }
            )
        )
)

router.use(
    new Elysia()
        .post("/update", 
            ...validated(
                updateUserSchema,
                authController.updateUser,
                { tags: ["Auth"], summary: "Update user details" }
            )
        )
)

export default router;