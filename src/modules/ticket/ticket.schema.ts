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

export const replyTicketSchema = z
    .object({
        ticketId: z.string(),
        message: z.string(),
    })

export const getTicket = z
    .object({
        id: z.string().optional(),
        ticketId: z.string().optional(),
        email: z.string().trim().toLowerCase().pipe(z.email()).optional(),
        userId: z.string().optional(),
        status: z.enum([
            "OPEN",
            "RESOLVED",
            "CLOSED"
        ]).optional(),
    })

export const getTicketDetails = z
    .object({
        ticketId: z.string(),
    })

export type CreateTicketInputType = z.infer<typeof createTicketSchema>;
export type AdminTicketCallbackInputType = z.infer<typeof adminTicketCallbackSchema>;
export type ReplyTicketInputType = z.infer<typeof replyTicketSchema>;
export type GetTicketInputType = z.infer<typeof getTicket>;
export type GetTicketDetailInputType = z.infer<typeof getTicketDetails>;