import { Context } from "elysia";
import { catchAsync } from "../../utils/common/helpers/CacheAsync";
import { CreateMemberInputType, DeleteMemberInputType, GetRegisterInputType, RoleChangeInputType, UpdateMemberInputType } from "./register.schema";
import { AuthSingleton } from "../../types/singleton";
import { registerService } from "./register.container";
import { sendResponse } from "../../utils/common/response/AppResponse";

export class RegisterController {
    getRegisteration = catchAsync(async (ctx: Context<{ body: GetRegisterInputType }, AuthSingleton>) => {
        const result = await registerService.getRegisteration(ctx.body, ctx.user);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Registeration fetched successfully",
            data: {
                registeration: result
            }
        })
    })

    registerMember = catchAsync(async (ctx: Context<{ body: CreateMemberInputType }, AuthSingleton>) => {
        const result = await registerService.registerMember(ctx.body, ctx.user);
        
        return sendResponse(ctx.set, 201, {
            success: true,
            message: "Registered Successfully",
            data: {
                registeration: result
            }
        })
    })

    updateMember = catchAsync(async (ctx: Context<{ body: UpdateMemberInputType }, AuthSingleton>) => {
        const result = await registerService.updateMember(ctx.body, ctx.user);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Updated User Successfully",
            data: {
                registeration: result
            }
        })
    })

    deleteMember = catchAsync(async (ctx: Context<{ body: DeleteMemberInputType }, AuthSingleton>) => {
        const result = await registerService.deleteMember(ctx.body, ctx.user);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Deleted User Successfully",
            data: {
                registeration: result
            }
        })
    })

    roleChange = catchAsync(async (ctx: Context<{ body: RoleChangeInputType }, AuthSingleton>) => {
        const result = await registerService.roleChange(ctx.body, ctx.user);
        
        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Role Changed Successfully",
            data: {
                registeration: result
            }
        })
    })
}