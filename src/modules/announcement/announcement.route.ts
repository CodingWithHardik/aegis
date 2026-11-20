import Elysia from "elysia";
import { authMiddleware } from "../../middleware/authentication.middleware";
import { validated } from "../../utils/common/validation/validated";
import { createAnnouncementSchema, listAnnouncementScheme } from "./announcement.schema";
import { AuthSingleton } from "../../types/singleton";
import { AnnouncementController } from "./announcement.controller";

const router = new Elysia({ prefix: "/announcement" });

const announcementController = new AnnouncementController();

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/create",
            ...validated<typeof createAnnouncementSchema, AuthSingleton>(
                createAnnouncementSchema,
                announcementController.createAnnouncement,
                { tags: ["Announcement"], summary: "Create Custom Announcement" }
            )
        )
        .post("/list",
            ...validated<typeof listAnnouncementScheme, AuthSingleton>(
                listAnnouncementScheme,
                announcementController.getAnnouncements,
                { tags: ["Announcement"], summary: "Get Announcement" }
            )
        )
)

export default router;