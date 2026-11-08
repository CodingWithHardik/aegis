import z from "zod";

export const subscribeNewsletterSchema = z
    .object({
        email: z.string().trim().toLowerCase().pipe(z.email()),
    })

export type SubscribeNewsletterInputType = z.infer<typeof subscribeNewsletterSchema>;