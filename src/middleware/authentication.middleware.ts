import Elysia from "elysia";
import { AppError } from "../utils/common/Errors/AppError";
import { verifyAccessToken } from "../modules/auth/auth.helper";

export const authMiddleware = new Elysia({ name: "auth-middleware" })
.resolve(({ headers }) => {
    const authHeader = headers.authorization;

    if (!authHeader) throw new AppError("Authentication Required", 401);
    if (!authHeader.startsWith("Bearer ")) throw new AppError("Invlaid format for authentication header", 401);

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) throw new AppError("Access Token Missing", 401)
    
    const payload = verifyAccessToken(accessToken);

    if (payload.status !== "VALID") throw new AppError(`Token ${payload.status === "EXPIRED" ? "Expired" : "Invalid"}`, 401);
    
    return { user: { userId: payload.payload.userId } }
})
.as("scoped")