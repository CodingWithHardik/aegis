import z from "zod";

export const createTicketSchema = z
    .object({
        name: z.string(),
        phoneNo: z.string().trim(),
        email: z.string().trim().toLowerCase().pipe(z.email()),
        message: z.string(),
    })
    .strict();

export const adminTicketCallbackSchema = z
    .object({
        code: z.string().trim(),
    })

export type CreateTicketInputType = z.infer<typeof createTicketSchema>;
export type AdminTicketCallbackInputType = z.infer<typeof adminTicketCallbackSchema>;
