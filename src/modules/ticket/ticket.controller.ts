import { Context, redirect } from "elysia";
import { catchAsync } from "../../utils/common/helpers/CacheAsync";
import { AdminTicketCallbackInputType, CreateTicketInputType } from "./ticket.schema";
import { AuthSingleton } from "../../types/singleton";
import { AppError } from "../../utils/common/Errors/AppError";
import { ticketOAuthClient } from "../../lib/ticketOauthClient";
import { ticketService } from "./ticket.container";
import { sendResponse } from "../../utils/common/response/AppResponse";
import { env } from "../../config/env.config";

export class TicketController {
    adminTicketAuth = catchAsync(async (ctx: Context<{}, AuthSingleton>) => {
        if (!ctx.user.isSuperAdmin) {
            throw new AppError("Unauthorized", 403)
        }

        const url = ticketOAuthClient.generateAuthUrl({
            access_type: "offline",
            prompt: "consent select_account",
            scope: [
                "https://www.googleapis.com/auth/gmail.readonly",
                "email",
                "profile",
                "openid"
            ]
        });

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Successfully Generated Auth Link",
            data: {
                url,
            }
        })
    })

    adminTicketCallback = catchAsync(async (ctx: Context<{ query: AdminTicketCallbackInputType}>) => {
        await ticketService.createAdminCallback(ctx.query);

        return redirect(env.FRONTEND_URL, 302)
    })
}