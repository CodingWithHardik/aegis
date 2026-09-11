export type EventResponseType = {
    id: string;
    year: number;
    type: string;
    name: string;
    about: string | null;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}