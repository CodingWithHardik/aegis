import Elysia from "elysia";
import { AuthController } from "./auth.controller";
import { loginUserSchema, registerUserSchema } from "./auth.schema";
import { authMiddleware } from "../../middleware/authentication.middleware";
import { validated } from "../../utils/common/validation/validated";

const router = new Elysia({ prefix: "/api/v1/auth" });

const authController = new AuthController();

router
    .post("/register", ...validated(registerUserSchema, authController.registerUser));

router
    .post("/login", ...validated(loginUserSchema, authController.loginUser));

router
    .use(authMiddleware)
    .get("/me", authController.getLoggedInUser);

export default router;