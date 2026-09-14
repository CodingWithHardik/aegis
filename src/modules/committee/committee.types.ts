export type CommitteeResponseType = {
    id: string;
    name: string;
    slug: string;
    agenda: string;
    about?: string | null;
    capacity: number;
    eventId: string;
    createdAt: Date;
    updatedAt: Date;
}