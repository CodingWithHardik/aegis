import Elysia from "elysia";
import { validated } from "../../utils/common/validation/validated";
import { adminTicketCallbackSchema, createTicketSchema } from "./ticket.schema";
import { TicketController } from "./ticket.controller";
import { authMiddleware } from "../../middleware/authentication.middleware";
import { AuthSingleton } from "../../types/singleton";

const router = new Elysia({ prefix: "/ticket" });

const ticketController = new TicketController();

router.use(
    new Elysia({ prefix: "/admin" })
        .get("/callback",
            ...validated<{ query: typeof adminTicketCallbackSchema }>(
                { query: adminTicketCallbackSchema },
                ticketController.adminTicketCallback,
                { tags: ["Admin"], summary: "Callback for admin ticket config" }
            )
        )
        .use(authMiddleware)
        .post("/auth",
            ticketController.adminTicketAuth,
            { detail: { tags: ["Admin"], summary: "Auth for admin ticket config" } }
        )
)

export default router;