import { Context } from "elysia"
import { catchAsync } from "../../utils/common/helpers/CacheAsync"
import { CreateAnnouncementInputType, ListAnnouncementInputType } from "./announcement.schema"
import { AuthSingleton } from "../../types/singleton"
import { announcementService } from "./announcement.container"
import { sendResponse } from "../../utils/common/response/AppResponse"

export class AnnouncementController {
    createAnnouncement = catchAsync(async (ctx: Context<{ body: CreateAnnouncementInputType }, AuthSingleton>) => {
        const result = await announcementService.createAnnouncement(ctx.body, ctx.user);

        return sendResponse(ctx.set, 201, {
            success: true,
            message: "Announcement Created Successfully",
            data: {
                announcement: result,
            }
        })
    })

    getAnnouncements = catchAsync(async (ctx: Context<{ body: ListAnnouncementInputType }, AuthSingleton>) => {
        const result = await announcementService.getAnnouncement(ctx.body, ctx.user)

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Successfully retrived all announcements",
            data: {
                announcement: result
            },
        })
    })
}