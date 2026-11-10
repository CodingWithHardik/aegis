import z from "zod";

export const markPresentAttendanceSchema = z
    .object({
        committeeId: z.string().trim(),
        users: z
            .array(
                z.object({
                    memberId: z.string().trim(),
                    isPresent: z.boolean().default(false),
                })
            )
            .min(1)
            .max(100)
            .refine(
                (users) => new Set(users.map((u) => u.memberId)).size === users.length,
                { error: "Duplicate memberId in users" }
            )
    })
    .strict();

export type MarkPresentAttendanceInputType = z.infer<typeof markPresentAttendanceSchema>