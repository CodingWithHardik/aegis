import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { env } from "../config/env.config";
import nodemailer, { Mail } from "nodemailer";
import { logger } from "../config/logger";
import { mailLimiter } from "../plugins/mailLimiter/mailLimiter.index";
import { MailerResults } from "../types/MailerResults";

const createTransporter = (accessKeyId: string, secretaAccessKey: string) => {
    const sesClient = new SESv2Client({
        region: env.AWS_SES_REGION,
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretaAccessKey,
        }
    })

    const transporter = nodemailer.createTransport({
        SES: {
            sesClient,
            SendEmailCommand
        }
    })

    transporter.use(
        "compile",
        mailLimiter({
            sesClient,
            maxDaily: 4950,
            onDailyLimit: "wait",
            ratePerSec: 9,
            buffer: 50,
            refreshMs: 60000,
        })
    )

    return transporter;
}

const primaryTransporter = createTransporter(
    env.AWS_SES_ACCESS_KEY_ID_PRIMARY,
    env.AWS_SES_SECRET_ACCESS_KEY_PRIMARY,
)

const secondaryTransporter = env.AWS_SES_ACCESS_KEY_ID_SECONDARY && env.AWS_SES_SECRET_ACCESS_KEY_SECONDARY
    ? createTransporter(
        env.AWS_SES_ACCESS_KEY_ID_SECONDARY,
        env.AWS_SES_SECRET_ACCESS_KEY_SECONDARY,
    ) : null;

export const sendMail = async (options: Mail.Options): Promise<MailerResults> => {
    try {
        const mailPrimary = await primaryTransporter.sendMail(options);
        return { ok: true, info: mailPrimary };
    } catch (primaryError) {
        logger.warn({
            event: "PRIMARY_MAILER_ERROR",
            message: primaryError,
        })
        if (!secondaryTransporter) return { ok: false, error: primaryError }
        try {
            const mailSecondary = await secondaryTransporter.sendMail(options);
            return { ok: true, info: mailSecondary }
        } catch (secondaryError) {
            logger.warn({
                event: "SECONDARY_MAILER_ERROR",
                message: secondaryError,
            })
            return { ok: false, error: secondaryError }
        }
    }
}