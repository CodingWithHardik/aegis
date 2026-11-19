import { env } from "../../config/env.config";
import { logger } from "../../config/logger";
import { emailFrom, getBodyText, headersOf, idsFromHeader, isAuthProblem, isAutomated, localPart, subjectTicketId } from "./mailWatcher.helpers";
import { IMailWatcherRepository } from "./mailWatcher.interface";
import { replyInfo, WatcherAccount } from "./mailWatcher.types";
import { google, type gmail_v1 } from "googleapis"

export type GmailWatcher = (account: WatcherAccount) => gmail_v1.Gmail;

export interface MailWatcherOptions {
    store: IMailWatcherRepository;
    pollMs?: number;
    catchUpWindow?: string;
    maxBackoffMs?: number;
    createGmail?: GmailWatcher;
    onReply?: (reply: replyInfo) => void | Promise<void>;
}

export type RunStatus = "idle" | "checked" | "baseline" | "caught-up" | "disconnected";
export interface RunResult {
    status: RunStatus;
    seen: number;
    saved: number;
}

export const code = (error: any): number | undefined => error?.code ?? error?.response?.status ?? error?.status;
const isNotFound = (error: any) => code(error) === 404;

export class mailWatcher {
    private gen = 0;
    private stopped = true;
    private timer?: NodeJS.Timeout;
    private store: IMailWatcherRepository;
    private failures = 0;
    private pollMs: number;
    private maxBackoffMs: number;
    private catchUpWindow: string;
    private createGmail: GmailWatcher;

    constructor(private i: MailWatcherOptions) {
        this.store = i.store;
        this.pollMs = i.pollMs ?? 30000;
        this.maxBackoffMs = i.maxBackoffMs ?? 5 * 60000;
        this.catchUpWindow = i.catchUpWindow ?? "2d";
        this.createGmail = i.createGmail ?? this.defaultGmail;
    }

    start(): void {
        if (!this.stopped) return;
        this.stopped = false;
        this.failures = 0
        const gen = ++this.gen;
        logger.info({
            event: "MAIL_WATCHER",
            message: "STARTED"
        })
        void this.tick(gen)
    }

    stop(): void {
        this.stopped = true;
        this.gen++;
        clearTimeout(this.timer)
        logger.warn({
            event: "MAIL_WATCHER",
            message: "STOPPED"
        })
    }

    private async tick(gen: number): Promise<void> {
        if (this.stopped || gen !== this.gen) return;
        let delay = this.pollMs;
        try {
            await this.runOnce();
            this.failures = 0;
        } catch (error: any) {
            this.failures++;
            delay = Math.min(this.pollMs * 2 ** (this.failures - 1), this.maxBackoffMs)
            logger.error({
                event: "MAIL_WATCHER_CHECK_FAILED",
                error: error?.message ?? error
            })
        }

        if (this.stopped || gen !== this.gen) return;
        this.timer = setTimeout(() => void this.tick(gen), delay)
    }

    async runOnce(): Promise<RunResult> {
        const account = await this.store.getAccount();
        if (!account || account.disconnected)
            return { status: "idle", seen: 0, saved: 0 }
        const gmail = this.createGmail(account);
        try {
            return await this.check(gmail, account)
        } catch (error: any) {
            if (isAuthProblem(error)) {
                logger.error({
                    event: "MAIL_WATECHER_AUTH",
                    message: "Account access rewoked",
                })
                await this.store.markDisconnected(account.refreshToken)
                return { status: "disconnected", seen: 0, saved: 0 }
            }
            throw error
        }
    }

    private async check(gmail: gmail_v1.Gmail, account: WatcherAccount): Promise<RunResult> {
        if (!account.historyId) {
            const profile = await gmail.users.getProfile({ userId: "me" })
            await this.store.saveHistoryId(account.refreshToken, profile.data.historyId!)
            return { status: "baseline", seen: 0, saved: 0 }
        }
        const ids = new Set<string>();
        let latest = account.historyId;
        let pageToken: string | undefined;

        try {
            do {
                const response = await gmail.users.history.list({
                    userId: "me",
                    startHistoryId: account.historyId,
                    historyTypes: ["messageAdded"],
                    labelId: "INBOX",
                    pageToken
                })
                for (const h of response.data.history ?? []) {
                    for (const m of h.messagesAdded ?? []) {
                        if (m.message?.id) ids.add(m.message.id)
                    }
                }
                if (response.data.historyId) latest = response.data.historyId;
                pageToken = response.data.nextPageToken ?? undefined;
            } while (pageToken);
        } catch (error: any) {
            if (isNotFound(error)) return this.catchUp(gmail, account);
            throw error;
        }
        let saved = 0;
        for (const id of ids) if (await this.processMessage(gmail, id, account)) saved++;
        await this.store.saveHistoryId(account.refreshToken, latest)
        return { status: "checked", seen: ids.size, saved }
    }

    private async catchUp(gmail: gmail_v1.Gmail, account: WatcherAccount): Promise<RunResult> {
        logger.warn({
            event: "MAIL_WATCHER",
            message: "Saved position expired."
        })
        const profile = await gmail.users.getProfile({ userId: "me" })
        const list = await gmail.users.messages.list({
            userId: "me",
            q: `in:inbox newer_than:${this.catchUpWindow}`,
            maxResults: 100,
        })
        
        const ids = (list.data.messages ?? [])
            .map((message) => message.id!)
            .filter(Boolean)
        let saved = 0;
        for (const id of ids) if (await this.processMessage(gmail, id, account)) saved++;
        await this.store.saveHistoryId(account.refreshToken, profile.data.historyId!);
        return { status: "caught-up", seen: ids.length, saved }
    }

    private async processMessage(gmail: gmail_v1.Gmail, gmailId: string, account: WatcherAccount): Promise<boolean> {
        let msg;
        try {
            msg = await gmail.users.messages.get({ userId: "me", id: gmailId, format: "full" });
        } catch (error: any) {
            if (isNotFound(error)) return false;
            throw error;
        }
        const header = headersOf(msg.data.payload);
        const from = emailFrom(header["from"] ?? "");
        if (!from || from === account.email.toLowerCase()) return false
        if (isAutomated(header, from)) return false;
        const wanted = [...new Set([...idsFromHeader(header["in-reply-to"]), ...idsFromHeader(header["references"]).reverse()])];
        let ticketdbId: string | null = null;
        let parentId: string | null = null;

        if (wanted.length) {
            const references = await this.store.findMessageByEmailIds(wanted);
            for (const w of wanted) {
                const hit = references.find((r) => r.emailMessageId && localPart(r.emailMessageId) === w)
                if (hit) {
                    ticketdbId = hit.ticketId;
                    parentId = hit.id;
                    break
                }
            }
        }
        if (!ticketdbId) {
            const publicId = subjectTicketId(header["subject"]);
            const ticket = publicId ? await this.store.findTicketByTCEId(publicId) : null;
            if (ticket && ticket.customerEmail.toLowerCase() === from) {
                ticketdbId = ticket.id;
                parentId = await this.store.findLastMessageId(ticket.id)
            }
        }

        if (!ticketdbId) return false;

        const text = getBodyText(msg.data.payload ?? undefined, msg.data.snippet);
        const saved = await this.store.saveMessage({
            ticketDbId: ticketdbId,
            parentMessageId: parentId,
            senderEmail: from,
            text,
            emailMessageId: header["message-id"]?.trim() || `gmail:${gmailId}`,
        })
        if (!saved) return false
        logger.info({
            event: "REPLY_SAVED",
            userEmail: from,
            ticketId: ticketdbId
        })

        if (this.i.onReply) {
            try {
                await this.i.onReply({
                    messageId: saved.id,
                    ticketDbId: ticketdbId,
                    senderEmail: from,
                    text,
                })
            } catch (e: any) {
                logger.error({
                    event: "MAIL_WATCHER_ONREPLY_FAILED",
                    message: `${e?.message ?? e}`
                })
            }
        }
        return true
    }

    private defaultGmail: GmailWatcher = (account) => {
        const client = new google.auth.OAuth2(env.TICKET_ADMIN_OAUTH_CLIENT_ID, env.TICKET_ADMIN_OAUTH_CLIENT_SECRET);
        client.setCredentials({
            refresh_token: account.refreshToken,
            access_token: account.accessToken ?? undefined,
            expiry_date: account.expiresAt?.getTime(),
        })
        client.on("tokens", (token) => {
            this.store
                .saveTokens(account.refreshToken, {
                    accessToken: token.access_token ?? undefined,
                    expiresAt: token.expiry_date ? new Date(token.expiry_date) : undefined,
                    refreshToken: token.refresh_token ?? undefined,
                })
                .catch((error) => 
                    logger.error({
                        event: "MAIL_WATCHER_TOKEN_REFRESH",
                        message: "Failed to refresh token",
                        error,
                    })
                )
        })
        
        return google.gmail({ version: "v1", auth: client })
    }
}