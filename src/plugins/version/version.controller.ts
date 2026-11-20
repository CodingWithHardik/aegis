import Elysia from "elysia";
import authRouter from "../../modules/auth/auth.route";
import eventRouter from "../../modules/event/event.route";
import teamRouter from "../../modules/team/team.route";
import committeeRouter from "../../modules/committee/committee.route";
import registerRouter from "../../modules/register/register.route";
import newsletterRouter from "../../modules/newsletter/newsletter.route";
import attendanceRouter from "../../modules/attendance/attendance.route";
import ticketRouter from "../../modules/ticket/ticket.route";
import announcementRouter from "../../modules/announcement/announcement.route";

export const versionRouteController = new Elysia()
.use(authRouter)
.use(eventRouter)
.use(teamRouter)
.use(committeeRouter)
.use(registerRouter)
.use(newsletterRouter)
.use(attendanceRouter)
.use(ticketRouter)
.use(announcementRouter);