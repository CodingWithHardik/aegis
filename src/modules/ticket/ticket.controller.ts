import { Context, redirect } from "elysia";
import { catchAsync } from "../../utils/common/helpers/CacheAsync";
import { AdminTicketCallbackInputType, CreateTicketInputType, GetTicketDetailInputType, GetTicketInputType, ReplyTicketInputType } from "./ticket.schema";
import { AuthSingleton } from "../../types/singleton";
import { AppError } from "../../utils/common/Errors/AppError";
import { ticketOAuthClient } from "../../lib/ticketOauthClient";
import { ticketService } from "./ticket.container";
import { sendResponse } from "../../utils/common/response/AppResponse";
import { env } from "../../config/env.config";

export class TicketController {
    createTicket = catchAsync(async (ctx: Context<{ body: CreateTicketInputType }>) => {
        const result = await ticketService.createTicketService(ctx.body);

        return sendResponse(ctx.set, 201, {
            success: true,
            message: "Ticket Created Successfully",
            data: {
                ticket: result
            }
        })
    })

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

    replyTicket = catchAsync(async (ctx: Context<{ body: ReplyTicketInputType }, AuthSingleton>) => {
        const result = await ticketService.replyTicket(ctx.body, ctx.user);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Successfully Replied to the ticket",
            data: {
                messgae: result,
            }
        })
    })

    getTicket = catchAsync(async (ctx: Context<{ body: GetTicketInputType }, AuthSingleton>) => {
        const result = await ticketService.getTicket(ctx.body, ctx.user);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Successfully retrived all tickets",
            data: {
                tickets: result
            }
        })
    })

    getTicketDetail = catchAsync(async (ctx: Context<{ body: GetTicketDetailInputType }, AuthSingleton>) => {
        const result = await ticketService.getTicketDetail(ctx.body, ctx.user);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Successfully Fetched Ticket Details",
            data: {
                ticket: result
            }
        })
    })
}