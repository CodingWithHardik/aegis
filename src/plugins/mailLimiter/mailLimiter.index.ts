import { GetAccountCommand } from "@aws-sdk/client-sesv2";
import { MailLimiterOptions } from "./mailLimiter.types";
import { logger } from "../../config/logger";
import { DailyLimitError, sleep } from "./mailLimiter.helper";

export function mailLimiter(options: MailLimiterOptions) {
    const { sesClient } = options;
    const ratePerSec = options.ratePerSec ?? 9;
    const refreshMs = options.refreshMs ?? 30_000;
    const buffer = options.buffer ?? 50;
    const onDailyLimit = options.onDailyLimit ?? "wait";
    const interval = 1000 / ratePerSec;

    let remaining = 0;
    let refreshedAt = 0;

    async function refresh() {
        try {
            const { SendQuota } = await sesClient.send(new GetAccountCommand({}));
            const sesMax = SendQuota?.Max24HourSend ?? -1;
            const max = Math.min(sesMax < 0 ? Infinity : sesMax, options.maxDaily ?? Infinity);
            remaining = max - (SendQuota?.SentLast24Hours ?? 0);
            refreshedAt = Date.now();
        } catch (err) {
            logger.warn({
                event: "SES_QUOTA_UNREADABLE",
                error: (err as Error).message
            })
        }
    }

    let nextSlot = 0;
    let waiting = 0;
    let chain: Promise<void> = Promise.resolve();

    async function getTurn() {
        for (;;) {
            if (Date.now() - refreshedAt > refreshMs) await refresh();
            if (remaining > buffer) break
            if (onDailyLimit === "reject") throw new DailyLimitError();
            await sleep(refreshMs)
        }

        const now = Date.now();
        const at = Math.max(now, nextSlot);
        nextSlot = at + interval;
        if (at > now) await sleep(at - now);
        
        remaining--;
    }

    const plugin = (_mail: unknown, done: (err?: Error | null) => void) => {
        waiting++;
        const turn = chain.then(getTurn);
        chain = turn.catch(() => {})
        turn.then(
            () => {
                waiting--;
                done();
            },
            (err) => {
                waiting--;
                done(err);
            }
        )
    };

    plugin.stats = () => (
        {
            waiting,
            remaining: Math.max(0, remaining - buffer)
        }
    )

    return plugin;
}