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

export type GetTeamInputType = z.infer<typeof getTeamSchema>;