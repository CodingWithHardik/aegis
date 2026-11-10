import { AttendanceRepository } from "./attendance.repository";
import { AttendanceService } from "./attendance.service";

const attendanceRepository = new AttendanceRepository();
const attendanceService = new AttendanceService(attendanceRepository);

export { attendanceService };