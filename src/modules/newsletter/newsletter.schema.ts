import z from "zod";

export const subscribeNewsletterSchema = z
    .object({
        email: z.string().trim().toLowerCase().pipe(z.email()),
    })

export const unsubscribeNewsletterSchema = z
    .object({
        token: z.string().trim(),
    })

export const emailValidation = z.string().trim().toLowerCase().pipe(z.email())
export const unsubscribeNewsletterServiceSchema = z
    .object({
        email: z.string().trim().toLowerCase().pipe(z.email())
    })

export type SubscribeNewsletterInputType = z.infer<typeof subscribeNewsletterSchema>;
export type UnsubscribeNewsletterInputType = z.infer<typeof unsubscribeNewsletterSchema>;
export type UnsubscribeNewsletterServiceInputType = z.infer<typeof unsubscribeNewsletterServiceSchema>;