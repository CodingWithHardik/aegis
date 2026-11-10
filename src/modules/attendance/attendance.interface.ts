import { Attendance, Committee, Member } from "../../../.prisma/client";
import { AttendanceUserTypes } from "./attendance.types";

export interface IAttendanceRepository {
    getCommitteeById(committeeId: string): Promise<Committee | null>;
    getMembersByCommitteeId(committeeId: string, ids: string[]): Promise<Member[]>
    getBoardMember(userId: string, committeeId: string, eventId: string): Promise<Member | null>
    markAttendance(users: AttendanceUserTypes, committeeId: string, eventId: string): Promise<Attendance[]>
}