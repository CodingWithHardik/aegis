import z from "zod";

export const subscribeNewsletterSchema = z
    .object({
        email: z.string().trim().toLowerCase(),
    })

export type SubscribeNewsletterInputType = z.infer<typeof subscribeNewsletterSchema>;