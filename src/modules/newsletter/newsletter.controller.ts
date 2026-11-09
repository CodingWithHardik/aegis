import { Context } from "elysia";
import { catchAsync } from "../../utils/common/helpers/CacheAsync";
import { emailValidation, SubscribeNewsletterInputType, UnsubscribeNewsletterInputType } from "./newsletter.schema"
import { newsletterService } from "./newsletter.container";
import { sendResponse } from "../../utils/common/response/AppResponse";
import { base62Decode } from "./newsletter.helper";
import { AppError } from "../../utils/common/Errors/AppError";

export class NewsletterController {
    subscribeNewsletter = catchAsync(async (ctx: Context<{ body: SubscribeNewsletterInputType }>) => {
        const result = await newsletterService.subscribeNewsletterService(ctx.body)

        return sendResponse(ctx.set, 201, {
            success: true,
            message: "Successfully subscribed to newsletter",
            data: {
                newsletter: result
            }
        })
    })

    unsubscribeNewsletter = catchAsync(async (ctx: Context<{ params: UnsubscribeNewsletterInputType }>) => {
        const decodedToken = base62Decode(ctx.params.token);
        if (!decodedToken.success) {
            throw new AppError("Invalid Token", 400)
        }
        const emailParsing = emailValidation.safeParse(decodedToken.email);
        if (!emailParsing.success) {
            throw new AppError("Invalid Token", 400)
        }
        const data = { email: emailParsing.data };
        await newsletterService.unsubscribeNewsletterService(data);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Successfully unsubscribed from newsletter"
        })
    })
}