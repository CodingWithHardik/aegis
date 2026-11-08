export type SubscriptionNewsletterResponseType = {
    id: string;
    email: string;
    isActive: boolean;
    unsubscribedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}