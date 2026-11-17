import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.config";

function OAuthClient() {
    return new OAuth2Client(
        env.TICKET_ADMIN_OAUTH_CLIENT_ID,
        env.TICKET_ADMIN_OAUTH_CLIENT_SECRET,
        env.TICKET_ADMIN_OAUTH_CALLBACK_URL
    )
}

export const ticketOAuthClient = OAuthClient();