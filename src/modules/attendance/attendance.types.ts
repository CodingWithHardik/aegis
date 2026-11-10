export type AttendanceUserTypes = {
    memberId: string;
    isPresent: boolean; 
}[];

export type AttendanceResponseType = {
    id: string;
    isPresent: boolean;
    memberId: string;
    committeeId: string;
    eventId: string;
    createdAt: Date;
    updatedAt: Date;
}