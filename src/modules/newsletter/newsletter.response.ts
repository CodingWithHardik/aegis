import { SubscriptionNewsletterResponseType } from "./newsletter.types";

export const toSubscribeNewsletterResponse = (subscription: SubscriptionNewsletterResponseType) => {
    return {
        id: subscription.id,
        email: subscription.email,
        updatedAt: subscription.updatedAt,
    }
}