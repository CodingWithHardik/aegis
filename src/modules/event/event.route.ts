import Elysia from "elysia";
import { authMiddleware } from "../../middleware/authentication.middleware";
import { validated } from "../../utils/common/validation/validated";
import { createEventSchema, deleteEventSchema, getEventSchema, updateEventSchema } from "./event.schema";
import { EventController } from "./event.controller";
import { AuthSingleton } from "../../types/singleton";

const router = new Elysia({ prefix: "/event" });

const eventController = new EventController();

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/",
            ...validated<typeof getEventSchema, AuthSingleton>(
                getEventSchema,
                eventController.getEvent
            )
        )
)

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/all",
            eventController.getAllEvents
        )
)

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/create",
            ...validated<typeof createEventSchema, AuthSingleton>(
                createEventSchema,
                eventController.createEvent
            )
        )
)

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/update", 
            ...validated<typeof updateEventSchema, AuthSingleton>(
                updateEventSchema,
                eventController.updateEvent
            )
        )
)

router.use(
    new Elysia()
        .use(authMiddleware)
        .post("/delete", 
            ...validated<typeof deleteEventSchema, AuthSingleton>(
                deleteEventSchema,
                eventController.deleteEvent
            )
        )
)

export default router;