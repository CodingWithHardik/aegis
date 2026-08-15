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
})

export type Env = z.infer<typeof envSchema>;