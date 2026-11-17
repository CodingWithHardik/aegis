import { SentMessageInfo } from "nodemailer";

export type MailerResults = 
    | { ok: true; info: SentMessageInfo }
    | { ok: false; error: unknown }
