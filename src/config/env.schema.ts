import z from "zod";

export const envSchema = z.object({
    NODE_ENV: z.enum(["production", "testing", "development"]),
    PORT: z.coerce.number().default(3000),
    FRONTEND_URL: z.url(),
    HOSTNAME: z.string().default("localhost"),
    DATABASE_URL: z.string(),
    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_USERNAME: z.string().optional(),
    REDIS_PASSWORD: z.string().optional(),
    GLOBAL_RATE_LIMIT_WINDOW: z.coerce.number().default(1),
    GLOBAL_RATE_LIMIT_SIZE: z.coerce.number().default(1000),
    LOGIN_RATE_LIMIT_WINDOW: z.coerce.number().default(1),
    LOGIN_RATE_LIMIT_SIZE: z.coerce.number().default(5),
    SALT_ROUNDS: z.coerce.number().default(12),
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRES_IN: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_EXPIRES_IN: z.string(),
})

export type Env = z.infer<typeof envSchema>;