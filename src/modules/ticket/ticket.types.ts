export type TicketConfigResponseType = {
    id: number;
    email: string;
    refreshToken: string;
    accessToken: string | null;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}