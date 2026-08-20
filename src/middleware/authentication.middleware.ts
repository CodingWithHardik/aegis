import Elysia from "elysia";
import { AppError } from "../utils/common/Errors/AppError";
import { verifyAccessToken } from "../modules/auth/auth.helper";
import { JwtPayloadType } from "../modules/auth/auth.types";
import jwt from "jsonwebtoken";

export const authMiddleware = new Elysia({ name: "auth-middleware" })
.resolve({ as: "scoped" }, ({ headers }) => {
    const authHeader = headers.authorization;

    if (!authHeader) throw new AppError("Authentication Required", 401);
    if (!authHeader.startsWith("Bearer ")) throw new AppError("Invlaid format for authentication header", 401);

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) throw new AppError("Access Token Missing", 401)
    
    try {
        const payload = verifyAccessToken(accessToken) as JwtPayloadType;
        return { user: { userId: payload.userId } }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) 
            throw new AppError("Token Expired", 401);
        if (error instanceof jwt.JsonWebTokenError)
            throw new AppError("Invalid Token", 401);
        throw error;
    }
})