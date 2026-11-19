import z from "zod";

export const envSchema = z.object({
    NODE_ENV: z.enum(["production", "testing", "development"]),
    TESTING: z.preprocess(
        (value) => value === "true",
        z.boolean().default(false),
    ),
    PORT: z.coerce.number().default(3000),
    FRONTEND_URL: z.url(),
    HOSTNAME: z.string().default("localhost"),
    DATABASE_URL: z.string(),
    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_USERNAME: z.string().optional(),
    REDIS_PASSWORD: z.string().optional(),
    AWS_SES_REGION: z.string(),
    AWS_SES_ACCESS_KEY_ID_PRIMARY: z.string(),
    AWS_SES_SECRET_ACCESS_KEY_PRIMARY: z.string(),
    AWS_SES_ACCESS_KEY_ID_SECONDARY: z.string().optional(),
    AWS_SES_SECRET_ACCESS_KEY_SECONDARY: z.string().optional(),
    GLOBAL_RATE_LIMIT_WINDOW: z.coerce.number().default(1),
    GLOBAL_RATE_LIMIT_SIZE: z.coerce.number().default(1000),
    LOGIN_RATE_LIMIT_WINDOW: z.coerce.number().default(1),
    LOGIN_RATE_LIMIT_SIZE: z.coerce.number().default(5),
    SALT_ROUNDS: z.coerce.number().default(12),
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRES_IN: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_EXPIRES_IN: z.string(),
    TICKET_ADMIN_OAUTH_CLIENT_ID: z.string(),
    TICKET_ADMIN_OAUTH_CLIENT_SECRET: z.string(),
    TICKET_ADMIN_OAUTH_CALLBACK_URL: z.string(),
    TICKET_MAIL_THRESHOLD: z.coerce.number().int().positive(),
})

export type Env = z.infer<typeof envSchema>;