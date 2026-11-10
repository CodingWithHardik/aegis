import { AttendanceResponseType } from "./attendance.types";

export const toAttendanceResponse = (attendance: AttendanceResponseType) => {
    return {
        id: attendance.id,
        memberId: attendance.memberId,
        isPresent: attendance.isPresent,
        updatedAt: attendance.updatedAt,
    }
}

export const toAttendanceMarkResponse = (attendance: AttendanceResponseType[]) => {
    return attendance.map(( attendance ) => toAttendanceResponse(attendance))
}