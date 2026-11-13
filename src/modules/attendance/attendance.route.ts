import Elysia from "elysia";
import { authMiddleware } from "../../middleware/authentication.middleware";
import { validated } from "../../utils/common/validation/validated";
import { AuthSingleton } from "../../types/singleton";
import { daysAttendanceSchema, markPresentAttendanceSchema } from "./attendance.schema";
import { AttendanceController } from "./attendance.controller";

const router = new Elysia({ prefix: "/attendance" });

const attendanceController = new AttendanceController();

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/mark", 
            ...validated<typeof markPresentAttendanceSchema, AuthSingleton>(
                markPresentAttendanceSchema,
                attendanceController.markAttendance,
                { tags: ["Attendance"], summary: "Mark attendance for a committee" }
            )
        )
)

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/days",
            ...validated<typeof daysAttendanceSchema, AuthSingleton>(
                daysAttendanceSchema,
                attendanceController.daysAttendance,
                { tags: ["Attendance"], summary: "Get attendance days" }
            )
        )
)

export default router;