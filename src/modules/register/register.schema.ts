import z from "zod";

export const getRegisterSchema = z.object({
    id: z.string().trim().optional(),
    eventId: z.string().trim().optional(),
    userId: z.string().trim().optional(),
    committeeId: z.string().trim().optional(),
    role: z.enum([
        "BOARD_MEMBER",
        "MEMBER"
    ]).optional(),
    applicationStatus: z.enum([
        "PENDING",
        "PROCESSED",
        "ALLOTED",
        "APPROVED",
        "REJECTED"
    ]).optional(),
    paymentType: z.enum([
        "CASH",
        "UPI"
    ]).optional()
}).strict()
.superRefine((data, ctx) => {
    if (data.eventId && !data.userId) {
        ctx.addIssue({
            code: "custom",
            message: "userId is required when eventId is provided",
            path: ["userId"]
        })
    }

    if (!data.eventId && data.userId) {
        ctx.addIssue({
            code: "custom",
            message: "eventId is required when userId is provided",
            path: ["eventId"]
        })
    }
})

export type GetRegisterInputType = z.infer<typeof getRegisterSchema>;