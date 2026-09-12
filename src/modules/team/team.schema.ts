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

export type GetTeamInputType = z.infer<typeof getTeamSchema>;
export type AddMemberInputType = z.infer<typeof addMemberSchema>;