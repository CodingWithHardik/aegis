import Elysia from "elysia";
import { authMiddleware } from "../../middleware/authentication.middleware";
import { validated } from "../../utils/common/validation/validated";
import { AuthSingleton } from "../../types/singleton";
import { markPresentAttendanceSchema } from "./attendance.schema";
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

export default router;