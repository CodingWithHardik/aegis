import { Context } from "elysia"
import { catchAsync } from "../../utils/common/helpers/CacheAsync"
import { CreateEventInputType, UpdateEventInputType } from "./event.schema"
import { AuthSingleton } from "./event.types";
import { AppError } from "../../middleware/error.middleware";
import { eventService } from "./event.container";
import { sendResponse } from "../../utils/common/response/AppResponse";

export class EventController {
    createEvent = catchAsync(async (ctx: Context<{ body: CreateEventInputType }, AuthSingleton>) => {
        const { type, name, about, startDate, endDate } = ctx.body;
        
        if (!ctx.user.isSuperAdmin) return new AppError("Unauthorized", 403);

        const result = await eventService.createEventService({
            type,
            name,
            about,
            startDate,
            endDate,
        }, ctx.user.id)

        return sendResponse(ctx.set, 201, {
            success: true,
            message: "Event Created Successfully",
            data: {
                event: result
            }
        })
        
    })

    updateEvent = catchAsync(async (ctx: Context<{ body: UpdateEventInputType }, AuthSingleton>) => {
        const result = await eventService.updateEventService(
            ctx.body,
            ctx.user,
        )

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Event Updated Successfully",
            data: {
                event: result
            }
        })
    })
}