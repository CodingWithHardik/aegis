import { Context } from "elysia";
import { catchAsync } from "../../utils/common/helpers/CacheAsync";
import { CreateCommitteeInputType, DeleteCommitteeInputType, GetCommitteeInputType, UpdateCommitteeInputType } from "./committee.schema";
import { AuthSingleton } from "../../types/singleton";
import { committeeService } from "./committee.container";
import { sendResponse } from "../../utils/common/response/AppResponse";

export class CommitteeController {
    getCommittee = catchAsync(async (ctx: Context<{ body: GetCommitteeInputType }, AuthSingleton>) => {
        const result = await committeeService.getCommitteeService(
            ctx.body,
            ctx.user,
        )

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Committee Fetched Successfully",
            data: {
                committee: result,
            }
        })
    })

    createCommittee = catchAsync(async (ctx: Context<{ body: CreateCommitteeInputType }, AuthSingleton>) => {
        const result = await committeeService.createCommittee(
            ctx.body,
            ctx.user,
        )

        return sendResponse(ctx.set, 201, {
            success: true,
            message: "Committee Created Successfully",
            data: {
                committee: result,
            }
        })
    })

    updateCommittee = catchAsync(async (ctx: Context<{ body: UpdateCommitteeInputType }, AuthSingleton>) => {
        const result = await committeeService.updateCommittee(
            ctx.body,
            ctx.user,
        )

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Committee Updated Successfully",
            data: {
                committee: result,
            }
        })
    })

    deleteCommittee = catchAsync(async (ctx: Context<{ body: DeleteCommitteeInputType }, AuthSingleton>) => {
        const result = await committeeService.deleteCommittee(
            ctx.body,
            ctx.user,
        )

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Committtee Deleted Successfully",
            data: {
                committee: result,
            }
        })
    })
}