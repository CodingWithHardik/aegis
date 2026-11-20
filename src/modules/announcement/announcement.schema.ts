import z from "zod";

export const createAnnouncementSchema = z
    .object({
        title: z.string().trim().min(1).max(100),
        text: z.string().trim().min(1).max(2000),
        priority: z.enum([
            "NORMAL",
            "IMPORTANT",
            "URGENT"
        ]).default("NORMAL"),
        isPinned: z.boolean().default(false),
        audience: z.enum([
            "EVENT",
            "COMMITTEE",
            "BOARD",
            "MEMBERS",
        ]),
        eventId: z.string().trim(),
        committeeId: z.string().trim().optional(),
        membersIds: z
            .array(z.string().trim())
            .min(1)
            .max(500)
            .refine(
                (ids) => new Set(ids).size === ids.length,
                { error: "Duplicate memberId in membersIds" }
            )
            .optional(),
        expiresAt: z.coerce.date().optional()
    }).strict()
    .superRefine((data, ctx) => {
        if (data.audience === "EVENT" && (data.committeeId || data.membersIds)) {
            ctx.addIssue({
                code: "custom",
                message: "event cannout have committeeId or memberIds",
                path: ["audience"]
            })
        }
        if (data.audience === "COMMITTEE") {
            if (!data.committeeId) {
                ctx.addIssue({
                    code: "custom",
                    message: "committeeId is required for the committee audience type",
                    path: ["committeeId"]
                })
            }
            if (data.membersIds) {
                ctx.addIssue({
                    code: "custom",
                    message: "memberid is not allowed for the committee audience type",
                    path: ["membersIds"]
                })
            }
        }
        if (data.audience === "BOARD" && data.membersIds) {
            ctx.addIssue({
                code: "custom",
                message: "memberid is not allowed for board audience type",
                path: ["membersIds"]
            })
        }

        if (data.audience === "MEMBERS") {
            if (!data.membersIds) {
                ctx.addIssue({
                    code: "custom",
                    message: "memberIds is required for member audience type",
                    path: ["membersIds"]
                })
            }
            if (data.committeeId) {
                ctx.addIssue({
                    code: "custom",
                    message: "committeeId is not allowed for member audience type",
                    path: ["membersIds"]
                })
            }
        }
        const start = new Date();
        if (data.expiresAt && data.expiresAt <= start) {
            ctx.addIssue({
                code: "custom",
                message: "expiredAt must be after posting announcement",
                path: ["expiresAt"]
            })
        }
    })

export const listAnnouncementScheme = z
    .object({
        eventId: z.string().trim(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(25)
    })
    .strict()

export type CreateAnnouncementInputType = z.infer<typeof createAnnouncementSchema>;
export type ListAnnouncementInputType = z.infer<typeof listAnnouncementScheme>;