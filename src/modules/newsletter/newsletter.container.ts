import { NewsletterRepository } from "./newsletter.repository";
import { NewsletterService } from "./newsletter.service";

const newsletterRepository = new NewsletterRepository();
const newsletterService = new NewsletterService(newsletterRepository);

export { newsletterService }