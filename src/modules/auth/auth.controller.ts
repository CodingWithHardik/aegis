import { catchAsync } from "../../utils/common/helpers/CacheAsync"
import type { Context } from "elysia";
import { LoginUserInputType, RefreshTokenBodyType, RegisterUserInputType } from "./auth.schema";
import { authService } from "./auth.container";
import { setAuthCookies } from "./auth.helper";
import { sendResponse } from "../../utils/common/response/AppResponse";
import { AuthContext } from "./auth.types";

export class AuthController {
    registerUser = catchAsync(async (ctx: Context<{ body: RegisterUserInputType }>) => {
        const { name, email, password } = ctx.body;

        const result = await authService.registerUserService({
            name,
            email,
            password
        })

        setAuthCookies(ctx.cookie, result.refreshToken)

        return sendResponse(ctx.set, 201, {
            success: true,
            message: "User Registered Successfully",
            data: {
                user: result.user,
                accessToken: result.accessToken
            }
        })
    })

    loginUser = catchAsync(async (ctx: Context<{ body: LoginUserInputType }>) => {
        const { email, password } = ctx.body;

        const result = await authService.loginUserService({ email, password });

        setAuthCookies(ctx.cookie, result.refreshToken)

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "User logged in successfully",
            data: {
                user: result.user,
                accessToken: result.accessToken
            }
        })
    })

    getLoggedInUser = catchAsync(async (ctx: AuthContext) => {
        const userId = ctx.user.id as string;

        const result = await authService.getLoggedInUserDetails(userId);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "User details fetched successfully",
            data: result,
        })
    })

    refreshAccessToken = catchAsync(async (ctx: Context<{ body: RefreshTokenBodyType }>) => {
        const refreshToken = ctx.cookie.refreshToken.value as string;
        const userId = ctx.body.userId;
        const authToken = ctx.body.accessToken;

        const result = await authService.refreshAccessTokenService(refreshToken, userId, authToken);

        setAuthCookies(ctx.cookie, result.refreshToken)

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Access token refreshed successfully",
            data: {
                user: result.user,
                accessToken: result.accessToken
            }
        })
    })
}