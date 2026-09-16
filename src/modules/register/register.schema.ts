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

export const createMemberSchema = z.object({
    name: z.string().trim().min(3, "Name must be at least 3 characters long").max(50, "Name must be at most 50 characters long"),
    about: z.string().trim().min(10, "About must be at least 10 characters long").max(500, "About must be at most 500 characters long").optional(),
    eventId: z.string().trim(),
    class: z.string().trim(),
    section: z.string().trim().optional(),
    paymentType: z.enum([
        "CASH",
        "UPI"
    ]),
    paymentLink: z.string().trim().optional(),
    munExperience: z.number().int().optional(),
    munAchievements: z.string().trim().optional(),
    additionalInfo: z.string().trim().optional(),
}).strict();

export type GetRegisterInputType = z.infer<typeof getRegisterSchema>;
export type CreateMemberInputType = z.infer<typeof createMemberSchema>;