import { logger } from "../../config/logger";
import { AppError } from "../../utils/common/Errors/AppError";
import { INewsletterRepository } from "./newsletter.interface";
import { toSubscribeNewsletterResponse } from "./newsletter.response";
import { SubscribeNewsletterInputType, UnsubscribeNewsletterServiceInputType } from "./newsletter.schema";

export class NewsletterService {
    constructor(private newsletterRepo: INewsletterRepository) {}

    async subscribeNewsletterService(data: SubscribeNewsletterInputType) {
        const existingSubscription = await this.newsletterRepo.findSubscription(data);

        if (existingSubscription && existingSubscription.isActive) {
            throw new AppError(`You are already subscribed`, 409)
        }

        const createSubscription = await this.newsletterRepo.subscribeNewsletter(data);

        logger.info({
            event: "SUBSCRIBED",
            email: createSubscription.email,
        })

        return toSubscribeNewsletterResponse(createSubscription)
    }

    async unsubscribeNewsletterService(data: UnsubscribeNewsletterServiceInputType) {
        const existingSubscription = await this.newsletterRepo.findSubscription(data);

        if (!existingSubscription || !existingSubscription.isActive) {
            throw new AppError(`You are not subscribed`, 409)
        }

        const unsubscribeSubscription = await this.newsletterRepo.unsubscribeNewsletter(data);

        logger.info({
            event: "UNSUBSCRIBED",
            email: unsubscribeSubscription.email,
        })

        return toSubscribeNewsletterResponse(unsubscribeSubscription)
    }
}