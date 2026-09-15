import { Context } from "elysia";
import { catchAsync } from "../../utils/common/helpers/CacheAsync";
import { GetRegisterInputType } from "./register.schema";
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
}