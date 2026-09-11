import { Context } from "elysia"
import { catchAsync } from "../../utils/common/helpers/CacheAsync"
import { CreateEventInputType, DeleteEventInputType, GetEventInputType, UpdateEventInputType } from "./event.schema"
import { AuthSingleton } from "../../types/AuthSingleton";
import { eventService } from "./event.container";
import { sendResponse } from "../../utils/common/response/AppResponse";

export class EventController {
    createEvent = catchAsync(async (ctx: Context<{ body: CreateEventInputType }, AuthSingleton>) => {
        const result = await eventService.createEventService(ctx.body, ctx.user)

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

    deleteEvent = catchAsync(async (ctx: Context<{ body: DeleteEventInputType }, AuthSingleton>) => {
        const result = await eventService.deleteEventService(
            ctx.body, 
            ctx.user
        );

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Event Deleted Successfully",
            data: {
                event: result
            }
        })
    })

    getEvent = catchAsync(async (ctx: Context<{ body: GetEventInputType }, AuthSingleton>) => {
        const result = await eventService.getEventService(
            ctx.body,
            ctx.user
        )
        
        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Event Fetched Successfully",
            data: {
                event: result
            }
        })
    })

    getAllEvents = catchAsync(async (ctx: Context<{}, AuthSingleton>) => {
        const result = await eventService.getAllEventsService(ctx.user);
        
        return sendResponse(ctx.set, 200, {
            success: true,
            message: "All Events Fetched Successfully",
            data: {
                events: result
            }
        })
    })
}