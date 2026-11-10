import { User } from "../../../.prisma/client";
import { logger } from "../../config/logger";
import { AppError } from "../../utils/common/Errors/AppError";
import { IAttendanceRepository } from "./attendance.interface";
import { toAttendanceMarkResponse } from "./attendance.response";
import { MarkPresentAttendanceInputType } from "./attendance.schema";

export class AttendanceService {
    constructor(private attendanceRepo: IAttendanceRepository) {}

    async markAttendance(data: MarkPresentAttendanceInputType, user: User) {
        const committee = await this.attendanceRepo.getCommitteeById(data.committeeId);
        if (!committee) {
            throw new AppError("Committee Not found", 422)
        }

        const boardMember = await this.attendanceRepo.getBoardMember(user.id, committee.id, committee.eventId);
        if (!boardMember) {
            throw new AppError("Unauthorized", 403)
        }

        const ids = data.users.map((u) => u.memberId);
        const filterUser = await this.attendanceRepo.getMembersByCommitteeId(data.committeeId, ids);
        const foundIds = new Set(filterUser.map((m) => m.id));
        const invalidIds = ids.filter((id) => !foundIds.has(id));

        if (invalidIds.length > 0) {
            throw new AppError(`Invalid members for this committee: ${invalidIds.join(", ")}`, 422)
        }

        const attendance = await this.attendanceRepo.markAttendance(
            data.users,
            data.committeeId,
            committee.eventId,
        )

        logger.info({
            event: "ATTENDANCE_CREATED",
            userId: user.id,
            committeeId: committee.id,
            count: data.users.length,
            present: data.users.filter((u) => u.isPresent).map((u) => u.memberId),
            absent: data.users.filter((u) => !u.isPresent).map((u) => u.memberId),
        })

        return toAttendanceMarkResponse(attendance)
    }
}