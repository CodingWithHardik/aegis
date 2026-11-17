import { ITicketRepository } from "./ticket.interface";
import { AdminTicketCallbackInputType } from "./ticket.schema";
import { AppError } from "../../utils/common/Errors/AppError";
import { ticketOAuthClient } from "../../lib/ticketOauthClient";
import { env } from "../../config/env.config";
import { toTicketAdminConfigResponse } from "./ticket.responses";

export class TicketService {
    constructor(private ticketRepo: ITicketRepository) {}

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
}