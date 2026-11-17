import z from "zod";

export const adminTicketCallbackSchema = z
    .object({
        code: z.string().trim(),
    })

export type AdminTicketCallbackInputType = z.infer<typeof adminTicketCallbackSchema>;
