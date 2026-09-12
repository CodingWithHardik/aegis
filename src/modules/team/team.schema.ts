import z from "zod";

export const getTeamSchema = z.preprocess(
    (value) => value ?? {},
    z.object({
        teamId: z.string().trim().optional(),
        eventId: z.string().trim().optional(),
        userId: z.string().trim().optional(),
        role: z.enum([
            "ORGANIZER",
            "DELEGATE_AFFAIRS",
            "FINANCE_MANAGER",
            "ADMIN",
            "SUPER_ADMIN"
        ]).optional(),
    }).strict()
)

export const addMemberSchema = z.object({
    name: z.string().trim().min(3, "Minimum 3 characters required").max(50, "Maximum 50 characters allowed"),
    about: z.string().trim().min(3, "Minimum 3 characters required").max(200, "Maximum 200 characters allowed").optional(),
    userId: z.string().trim(),
    eventId: z.string().trim(),
    role: z.enum([
        "ORGANIZER",
        "DELEGATE_AFFAIRS",
        "FINANCE_MANAGER",
        "ADMIN",
        "SUPER_ADMIN"
    ]),
}).strict();

export const updateMemberSchema = z.object({
    name: z.string().trim().min(3, "Minimum 3 characters required").max(50, "Maximum 50 characters allowed").optional(),
    about: z.string().trim().min(3, "Minimum 3 characters required").max(200, "Maximum 200 characters allowed").optional(),
    role: z.enum([
        "ORGANIZER",
        "DELEGATE_AFFAIRS",
        "FINANCE_MANAGER",
        "ADMIN",
        "SUPER_ADMIN"
    ]).optional(),
    userId: z.string().trim().optional(),
    eventId: z.string().trim().optional(),
    teamId: z.string().trim().optional(),
})
.strict()
.superRefine((data, ctx) => {
    if (!data.teamId && (!data.userId || !data.eventId)) {
        ctx.addIssue({
            code: "custom",
            message: "At least one is required: userId or eventId & teamId",
            stack: ["userId", "eventId", "teamId"]
        })
    }
    if (!data.name && !data.about && !data.role) {
        ctx.addIssue({
            code: "custom",
            message: "At least one is required: name, about, role",
            stack: ["name", "about", "role"]
        })
    }
})


export type GetTeamInputType = z.infer<typeof getTeamSchema>;
export type AddMemberInputType = z.infer<typeof addMemberSchema>;
export type UpdateMemberInputType = z.infer<typeof updateMemberSchema>;