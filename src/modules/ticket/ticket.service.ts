import { randomUUID } from "crypto";
import { ITicketRepository } from "./ticket.interface";
import { AdminTicketCallbackInputType, CreateTicketInputType, ReplyTicketInputType } from "./ticket.schema";
import { render } from "react-email";
import { createTicketEmail } from "../../../emails/ticket/createTicket"
import { sendMail } from "../../lib/mailer";
import { AppError } from "../../utils/common/Errors/AppError";
import { ticketOAuthClient } from "../../lib/ticketOauthClient";
import { env } from "../../config/env.config";
import { toMessageResponse, toTicketAdminConfigResponse, toTicketResponse } from "./ticket.responses";
import { User } from "../../../.prisma/client";
import { replyTicket } from "../../../emails/ticket/replyTicket";
import { replyReceived } from "../../../emails/ticket/replyReceived";

export class TicketService {
    constructor(private ticketRepo: ITicketRepository) {}

    async createTicketService(data: CreateTicketInputType) {
        const user = await this.ticketRepo.findUserByEmail(data.email);
        const temporary = await this.ticketRepo.createTicket(
            data,
            `temp-${randomUUID()}`,
            user,
        );
        const ticketId = `TCE${String(temporary.seq).padStart(5, "0")}`
        const ticket = await this.ticketRepo.updateTicketId(temporary.id, ticketId);
        const authAdmin = await this.ticketRepo.getTicketConfig();
        if (!authAdmin) {
            throw new AppError("Something Went Wrong", 500);
        }
        const timeDate = temporary.createdAt.toLocaleString("en-US", {
            year: 'numeric',
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata"
        })
        const emailHTML = await render(createTicketEmail(ticketId, data.name, timeDate, data.message))
        const sendEmail = await sendMail({
            from: `${authAdmin.name ? `${authAdmin.name} ` : ""}Support <${authAdmin.email}>`,
            to: data.email,
            subject: `[TICKET - ${ticketId}] Thank You for Reaching Out`,
            html: emailHTML,

        })
        if (!sendEmail.ok) {
            throw new AppError("Email Not Sent", 500)
        } 
        const messageId = sendEmail.info.messageId;
        await this.ticketRepo.addTicketMessageId(temporary.message[0].id, messageId)
        return toTicketResponse(ticket)
    }

    async createAdminCallback(data: AdminTicketCallbackInputType) {
        const { tokens } = await ticketOAuthClient.getToken(data.code);
        if (!tokens.refresh_token || !tokens.id_token || !tokens.access_token || !tokens.expiry_date) {
            throw new AppError("Something Went Wrong Retry Auth", 400)
        }
        const user = await ticketOAuthClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: env.TICKET_ADMIN_OAUTH_CLIENT_ID
        })

        const payload = await user.getPayload();
        if (!payload || !payload.email) {
            throw new AppError("Something Went Wrong Retry Auth", 400)
        }

        const createdConfig = await this.ticketRepo.manageTicketConfig(
            tokens.refresh_token,
            tokens.access_token,
            new Date(tokens.expiry_date),
            payload.email,
            payload.name,
        )
        
        return toTicketAdminConfigResponse(createdConfig)
    }

    async replyTicket(data: ReplyTicketInputType, user: User) {
        const isStaff = user.isSuperAdmin ? true : !!(await this.ticketRepo.getActiveYearTeam(user.id))
        const ticket = await this.ticketRepo.getTicketById(data.ticketId);
        const isOwner = !!ticket && (ticket.userConnected ? ticket.userId === user.id : ticket.customerEmail.toLowerCase() === user.email?.toLowerCase())
        if (!ticket || (!isStaff && !isOwner)) {
            throw isStaff
                ? new AppError("Ticket Not found", 404)
                : new AppError("You dont have access to this ticket", 404)
        }
        const messages = await this.ticketRepo.getMessages(data.ticketId);
        const messageIds = messages
            .map((m) => m.emailMessageId)
            .filter((mid) => mid !== null);
        const lastmessage = messages
            .at(-1);
        const lastSentMessage = messages
            .filter((message) => message.isFirst === false)
            .filter((message) => message.source === "WEBSITE")
            .at(-1);
        const authAdmin = await this.ticketRepo.getTicketConfig();
        if (!authAdmin) {
            throw new AppError("Something Went Wrong", 500);
        }
        const maildesign = isStaff ? replyTicket(ticket.ticketId, `${ticket.customerName.split(" ")[0]}`, data.message, user.name, authAdmin.name ? `${authAdmin.name}` : "" )
            : replyReceived(ticket.ticketId, `${ticket.customerName.split(" ")[0]}`, authAdmin.name ? `${authAdmin.name}` : "")
        const emailHTML = await render(maildesign)
        const createdAt = lastSentMessage?.createdAt
            ? lastSentMessage.createdAt.getTime()
            : null;
        const isOlderTheThreshold = createdAt === null || Date.now() - createdAt > env.TICKET_MAIL_THRESHOLD;
        let messageId: string | null = null;
        if (isOlderTheThreshold) {
            const mail = await sendMail({
                from: `${isStaff ? `${user.name.split(" ")[0]} from` : ""} ${authAdmin.name ? `${authAdmin.name} ` : ""}${isStaff ? "" : "Support"} <${authAdmin.email}>`,
                to: ticket.customerEmail,
                subject: `Re: [TICKET - ${ticket.ticketId}] Thank You for Reaching Out`,
                html: emailHTML,
                inReplyTo: messageIds.at(-1) || undefined,
                references: messageIds.join(" ") || undefined,
            })
            if (!mail?.ok) {
                throw new AppError("Email Not Sent", 500)
            }
            messageId = mail.info.messageId;
        }
        const newMessage = await this.ticketRepo.addMessage(ticket.id, isStaff, authAdmin.email, data.message, messageId, lastmessage?.id ?? null);
        return toMessageResponse(newMessage)
    }
}