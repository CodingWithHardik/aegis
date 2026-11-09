import { Subscriptions } from "../../../.prisma/client";
import { SubscribeNewsletterInputType, UnsubscribeNewsletterServiceInputType } from "./newsletter.schema";

export interface INewsletterRepository {
    findSubscription({ email }: { email: string }): Promise<Subscriptions | null>;
    subscribeNewsletter(data: SubscribeNewsletterInputType): Promise<Subscriptions>;
    unsubscribeNewsletter(data: UnsubscribeNewsletterServiceInputType): Promise<Subscriptions>
}