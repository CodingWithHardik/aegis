import Elysia from "elysia";
import authRouter from "../../modules/auth/auth.route";
import eventRouter from "../../modules/event/event.route";

export const versionRouteController = new Elysia()
.use(authRouter)
.use(eventRouter);