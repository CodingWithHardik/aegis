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
        "REJECTED_PORTFOLIO",
        "REJECTED_PAYMENT",
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

export const updateMemberSchema = z.object({
    memberId: z.string().trim().optional(),
    eventId: z.string().trim().optional(),
    userId: z.string().trim().optional(),
    name: z.string().trim().min(3, "Name must be at least 3 characters long").max(50, "Name must be at most 50 characters long").optional(),
    about: z.string().trim().min(10, "About must be at least 10 characters long").max(500, "About must be at most 500 characters long").optional(),
    class: z.string().trim().optional(),
    section: z.string().trim().optional(),
    munExperience: z.number().int().optional(),
    munAchievements: z.string().trim().optional(),
    additionalInfo: z.string().trim().optional(),
}).strict()
.superRefine((data, ctx) => {
    const hasMemberId = !!data.memberId;
    const hasEventAndUserId = !!data.eventId && !!data.userId;
    if (!hasMemberId && hasEventAndUserId) {
        ctx.addIssue({
            code: "custom",
            message: "Provide either memberId or both eventId and userId",
            path: ["memberId", "eventId", "userId"]
        })
    }
    if (
        data.name !== undefined ||
        data.about !== undefined ||
        data.class !== undefined ||
        data.section !== undefined ||
        data.munExperience !== undefined ||
        data.munAchievements !== undefined ||
        data.additionalInfo !== undefined
    ) {
        ctx.addIssue({
            code: "custom",
            message: "At least one field to update must be provided",
            path: ["name", "about", "class", "section", "munExperience", "munAchievements", "additionalInfo"]
        })
    }
})


export const deleteMemberSchema = z.object({
    memberId: z.string().trim().optional(),
    eventId: z.string().trim().optional(),
    userId: z.string().trim().optional(),
}).strict()
.refine(
    (data) =>
        !!data.memberId ||
    (!!data.eventId && !!data.userId),
    {
        error: "Either memberId or eventId and userId are required",
        path: ["memberId", "eventId", "userId"]
    }
)

export const roleChangeSchema = z.object({
    memberId: z.string().trim().optional(),
    eventId: z.string().trim().optional(),
    userId: z.string().trim().optional(),
    role: z.enum([
        "BOARD_MEMBER",
        "MEMBER"
    ])
}).strict()
.superRefine((data, ctx) => {
    const hasMemberId = !!data.memberId;
    const hasEventAndUserId = !!data.eventId && !!data.userId;
    if (!hasMemberId && !hasEventAndUserId) {
        ctx.addIssue({
            code: "custom",
            message: "Provide either memberId or both eventId and userId",
            path: ["memberId", "eventId", "userId"]
        })
    }
    if (data.role === undefined) {
        ctx.addIssue({
            code: "custom",
            message: "Role is required",
            path: ["role"]
        })
    }
})

export const statusChangeSchema = z.object({
    memberId: z.string().trim().optional(),
    eventId: z.string().trim().optional(),
    userId: z.string().trim().optional(),
    applicationStatus: z.enum([
        "PENDING",
        "PROCESSED",
        "ALLOTED",
        "APPROVED",
        "REJECTED_PORTFOLIO",
        "REJECTED_PAYMENT",
        "REJECTED"
    ])
}).strict()
.superRefine((data, ctx) => {
    const hasMemberId = !!data.memberId;
    const hasEventAndUserId = !!data.eventId && !!data.userId;
    if (!hasMemberId && !hasEventAndUserId) {
        ctx.addIssue({
            code: "custom",
            message: "Provide either memberId or both eventId and userId",
            path: ["memberId", "eventId", "userId"]
        })
    }
    if (data.applicationStatus === undefined) {
        ctx.addIssue({
            code: "custom",
            message: "Application status is required",
            path: ["applicationStatus"]
        })
    }
})

export const paymentChangeSchema = z.object({
    memberId: z.string().trim().optional(),
    eventId: z.string().trim().optional(),
    userId: z.string().trim().optional(),
    paymentType: z.enum([
        "CASH",
        "UPI"
    ]),
    paymentLink: z.string().trim().optional()
}).strict()
.superRefine((data, ctx) => {
    const hasMemberId = !!data.memberId;
    const hasEventAndUserId = !!data.eventId && !!data.userId;
    if (!hasMemberId && !hasEventAndUserId) {
        ctx.addIssue({
            code: "custom",
            message: "Provide either memberId or both eventId and userId",
            path: ["memberId", "eventId", "userId"]
        })
    }
    if (data.paymentType === undefined) {
        ctx.addIssue({
            code: "custom",
            message: "Payment type is required",
            path: ["paymentType"]
        })
    }

    if (data.paymentType === "UPI" && !data.paymentLink) {
        ctx.addIssue({
            code: "custom",
            message: "Payment link is required when payment type is UPI",
            path: ["paymentLink"]
        })
    }

    if (data.paymentType === "CASH" && data.paymentLink) {
        ctx.addIssue({
            code: "custom",
            message: "Payment link should not be provided when payment type is CASH",
            path: ["paymentLink"]
        })
    }
})

export const acceptPaymentSchema = z.object({
    memberId: z.string().trim().optional(),
    eventId: z.string().trim().optional(),
    userId: z.string().trim().optional()
}).strict()
.superRefine((data, ctx) => {
    const hasMemberId = !!data.memberId;
    const hasEventAndUserId = !!data.eventId && !!data.userId;
    if (!hasMemberId && !hasEventAndUserId) {
        ctx.addIssue({
            code: "custom",
            message: "Provide either memberId or both eventId and userId",
            path: ["memberId", "eventId", "userId"]
        })
    }
})

export type GetRegisterInputType = z.infer<typeof getRegisterSchema>;
export type CreateMemberInputType = z.infer<typeof createMemberSchema>;
export type UpdateMemberInputType = z.infer<typeof updateMemberSchema>;
export type DeleteMemberInputType = z.infer<typeof deleteMemberSchema>;
export type RoleChangeInputType = z.infer<typeof roleChangeSchema>;
export type StatusChangeInputType = z.infer<typeof statusChangeSchema>;
export type PaymentChangeInputType = z.infer<typeof paymentChangeSchema>;
export type AcceptPaymentInputType = z.infer<typeof acceptPaymentSchema>;