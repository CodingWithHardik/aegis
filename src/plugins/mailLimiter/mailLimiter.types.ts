import { SESv2Client } from "@aws-sdk/client-sesv2"

export type MailLimiterOptions = {
    sesClient: SESv2Client;
    ratePerSec?: number;
    maxDaily?: number;
    buffer?: number;
    refreshMs?: number;
    onDailyLimit?: "wait" | "reject";
}