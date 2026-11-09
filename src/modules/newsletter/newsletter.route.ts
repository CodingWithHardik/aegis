import Elysia from "elysia";
import { validated } from "../../utils/common/validation/validated";
import { subscribeNewsletterSchema, unsubscribeNewsletterSchema } from "./newsletter.schema";
import { NewsletterController } from "./newsletter.controller";

const router = new Elysia({ prefix: "/newsletter" });

const newsletterController = new NewsletterController();

router.use(
    new Elysia()
        .post("/subscribe", {
            ...validated<typeof subscribeNewsletterSchema>(
                subscribeNewsletterSchema,
                newsletterController.subscribeNewsletter,
                { tags: ["NewsLetters"], summary: "Subscribe to newsletters" }
            )
        })
)

router.use(
    new Elysia()
        .get("/unsubscribe/:token", {
            ...validated<{ params: typeof unsubscribeNewsletterSchema }>(
                { params: unsubscribeNewsletterSchema },
                newsletterController.unsubscribeNewsletter,
                { tags: ["NewsLetters"], summary: "Unsubscribe to newsletters" }
            )
        })
)