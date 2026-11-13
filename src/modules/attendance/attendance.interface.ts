import { Attendance, AttendanceStatus, Committee, Event, Member } from "../../../.prisma/client";
import { AttendanceUserTypes } from "./attendance.types";

export interface IAttendanceRepository {
    getCommitteeById(committeeId: string): Promise<Committee | null>;
    getMembersByCommitteeId(committeeId: string, ids: string[]): Promise<Member[]>
    getBoardMember(userId: string, committeeId: string, eventId: string): Promise<Member | null>
    getEventById(eventId: string): Promise<Event | null>
    markAttendance(users: AttendanceUserTypes, committeeId: string, eventId: string, date: Date): Promise<Attendance[]>
    addAttendanceStatus(committeeId: string, status: AttendanceStatus): Promise<Committee>;
}