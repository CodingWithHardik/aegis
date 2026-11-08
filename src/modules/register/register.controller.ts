import { Context } from "elysia";
import { catchAsync } from "../../utils/common/helpers/CacheAsync";
import { AcceptPaymentInputType, AllotCommitteeInputType, CreateMemberInputType, DeleteMemberInputType, GetRegisterInputType, PaymentChangeInputType, RoleChangeInputType, StatusChangeInputType, UpdateMemberInputType } from "./register.schema";
import { AuthSingleton } from "../../types/singleton";
import { registerService } from "./register.container";
import { sendResponse } from "../../utils/common/response/AppResponse";

export class RegisterController {
    getRegistration = catchAsync(async (ctx: Context<{ body: GetRegisterInputType }, AuthSingleton>) => {
        const result = await registerService.getRegistration(ctx.body, ctx.user);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Registration fetched successfully",
            data: {
                registration: result
            }
        })
    })

    registerMember = catchAsync(async (ctx: Context<{ body: CreateMemberInputType }, AuthSingleton>) => {
        const result = await registerService.registerMember(ctx.body, ctx.user);
        
        return sendResponse(ctx.set, 201, {
            success: true,
            message: "Registered Successfully",
            data: {
                registration: result
            }
        })
    })

    updateMember = catchAsync(async (ctx: Context<{ body: UpdateMemberInputType }, AuthSingleton>) => {
        const result = await registerService.updateMember(ctx.body, ctx.user);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Updated User Successfully",
            data: {
                registration: result
            }
        })
    })

    deleteMember = catchAsync(async (ctx: Context<{ body: DeleteMemberInputType }, AuthSingleton>) => {
        const result = await registerService.deleteMember(ctx.body, ctx.user);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Deleted User Successfully",
            data: {
                registration: result
            }
        })
    })

    roleChange = catchAsync(async (ctx: Context<{ body: RoleChangeInputType }, AuthSingleton>) => {
        const result = await registerService.roleChange(ctx.body, ctx.user);
        
        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Role Changed Successfully",
            data: {
                registration: result
            }
        })
    })

    statusChange = catchAsync(async (ctx: Context<{ body: StatusChangeInputType }, AuthSingleton>) => {
        const result = await registerService.statusChange(ctx.body, ctx.user);
        
        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Role Changed Successfully",
            data: {
                registration: result
            }
        })
    })

    paymentModeChange = catchAsync(async (ctx: Context<{ body: PaymentChangeInputType }, AuthSingleton>) => {
        const result = await registerService.paymentStatusChange(ctx.body, ctx.user);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Payment Mode Changed Successfully",
            data: {
                registration: result
            }
        })
    })

    acceptPayment = catchAsync(async (ctx: Context<{ body: AcceptPaymentInputType }, AuthSingleton>) => {
        const result = await registerService.acceptPayment(ctx.body, ctx.user);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Successfully Accepted Payment of the User",
            data: {
                registration: result
            }
        })
    })

    allotCommittee = catchAsync(async (ctx: Context<{ body: AllotCommitteeInputType }, AuthSingleton>) => {
        const result = await registerService.allotCommittee(ctx.body, ctx.user);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Successfully Alloted Committee to the User",
            data: {
                registration: result
            }
        })
    })
}