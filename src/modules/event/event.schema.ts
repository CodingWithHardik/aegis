import { z } from "zod";

export const createEventSchema = z.object({
    type: z.enum(["INTRA", "MAIN"]),
    name: z.string().trim().min(3, "Minimum 3 characters required").max(50, "Maximum 50 characters allowed"),
    about: z.optional(z.string().trim().min(3, "Minimum 3 characters required").max(200, "Maximum 200 characters allowed")),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
}).strict();

export type CreateEventInputType = z.infer<typeof createEventSchema>;