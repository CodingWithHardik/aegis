import { Context } from "elysia";
import { catchAsync } from "../../utils/common/helpers/CacheAsync";
import { SubscribeNewsletterInputType } from "./newsletter.schema"
import { newsletterService } from "./newsletter.container";
import { sendResponse } from "../../utils/common/response/AppResponse";

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
}