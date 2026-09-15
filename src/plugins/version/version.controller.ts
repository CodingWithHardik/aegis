import Elysia from "elysia";
import authRouter from "../../modules/auth/auth.route";
import eventRouter from "../../modules/event/event.route";
import teamRouter from "../../modules/team/team.route";
import committeeRouter from "../../modules/committee/committee.route";
import registerRouter from "../../modules/register/register.route";

export const versionRouteController = new Elysia()
.use(authRouter)
.use(eventRouter)
.use(teamRouter)
.use(committeeRouter)
.use(registerRouter);