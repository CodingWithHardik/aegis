import { Subscriptions } from "../../../.prisma/client";
import { prisma } from "../../lib/prisma";
import { cachedQuery, invalidate } from "../../utils/common/helpers/CacheQuery";
import { measureQuery } from "../../utils/common/helpers/MeasureQuery";
import { cacheKeys } from "../../utils/common/redis/cacheKeys";
import { INewsletterRepository } from "./newsletter.interface";
import { SubscribeNewsletterInputType, UnsubscribeNewsletterServiceInputType } from "./newsletter.schema";

export class NewsletterRepository implements INewsletterRepository {
    async findSubscription({ email }: { email: string; }): Promise<Subscriptions | null> {
        return cachedQuery(
            "findSubscription",
            {
                key: cacheKeys.subscriptionNewsletter(email),
                ttl: 600,
            },
            () => 
                prisma.subscriptions.findUnique({
                    where: {
                        email
                    }
                })
        )
    }

    async subscribeNewsletter(data: SubscribeNewsletterInputType): Promise<Subscriptions> {
        invalidate(cacheKeys.subscriptionNewsletter(data.email))
        return measureQuery("subscribeNewsletter", () => 
            prisma.subscriptions.upsert({
                where: data,
                create: data,
                update: {
                    isActive: true,
                    unsubscribedAt: null
                }
            })
        )
    }

    async unsubscribeNewsletter(data: UnsubscribeNewsletterServiceInputType): Promise<Subscriptions> {
        return measureQuery("unsubscribeNewsletter", () => 
            prisma.subscriptions.update({
                where: data,
                data: {
                    isActive: false,
                    unsubscribedAt: new Date(),
                }
            })
        )
    }
}