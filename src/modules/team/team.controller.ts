import { Context } from "elysia";
import { catchAsync } from "../../utils/common/helpers/CacheAsync";
import { AddMemberInputType, GetTeamInputType, UpdateMemberInputType } from "./team.schema";
import { AuthSingleton } from "../../types/singleton";
import { teamService } from "./team.container";
import { sendResponse } from "../../utils/common/response/AppResponse";

export class TeamController {
    getTeam = catchAsync(async (ctx: Context<{ body: GetTeamInputType }, AuthSingleton>) => {
        const result = await teamService.getTeam(
            ctx.body,
            ctx.user,
        )

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Team Fetched Successfully",
            data: {
                team: result,
            }
        })
    })

    addMember = catchAsync(async (ctx: Context<{ body: AddMemberInputType }, AuthSingleton>) => {
        const result = await teamService.addMember(
            ctx.body,
            ctx.user,
        )

        return sendResponse(ctx.set, 201, {
            success: true,
            message: "Member Added Successfully",
            data: {
                team: result,
            }
        })
    })

    updateMember = catchAsync(async (ctx: Context<{ body: UpdateMemberInputType }, AuthSingleton>) => {
        const result = await teamService.updateMember(
            ctx.body,
            ctx.user,
        )

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Member Updated Successfully",
            data: {
                team: result,
            }
        })
    })
}