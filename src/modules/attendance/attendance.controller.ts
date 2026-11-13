import { Context } from "elysia";
import { catchAsync } from "../../utils/common/helpers/CacheAsync";
import { DaysAttendanceInputType, MarkPresentAttendanceInputType } from "./attendance.schema";
import { AuthSingleton } from "../../types/singleton";
import { attendanceService } from "./attendance.container";
import { sendResponse } from "../../utils/common/response/AppResponse";

export class AttendanceController {
    markAttendance = catchAsync(async (ctx: Context<{ body: MarkPresentAttendanceInputType }, AuthSingleton>) => {
        const result = await attendanceService.markAttendance(ctx.body, ctx.user);

        return sendResponse(ctx.set, 201, {
            success: true,
            message: "Attendance Marked Successfully",
            data: {
                attendance: result,
            }
        })
    })

    daysAttendance = catchAsync(async (ctx: Context<{ body: DaysAttendanceInputType }, AuthSingleton>) => {
        const result = await attendanceService.getAttendanceDays(ctx.body, ctx.user);

        return sendResponse(ctx.set, 200, {
            success: true,
            message: "Successfully fetched Days",
            data: {
                days: result,
            }
        })
    })
}