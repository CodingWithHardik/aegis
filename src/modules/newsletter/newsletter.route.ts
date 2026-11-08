import Elysia from "elysia";
import { validated } from "../../utils/common/validation/validated";
import { subscribeNewsletterSchema } from "./newsletter.schema";
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