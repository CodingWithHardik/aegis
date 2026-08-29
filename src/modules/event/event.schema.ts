import { z } from "zod";

export const createEventSchema = z.object({
    type: z.enum(["INTRA", "MAIN"]),
    name: z.string().trim().min(3, "Minimum 3 characters required").max(50, "Maximum 50 characters allowed"),
    about: z.optional(z.string().trim().min(3, "Minimum 3 characters required").max(200, "Maximum 200 characters allowed")),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
}).strict();

export const updateEventSchema = z.object({
    eventId: z.string().trim(),
    name: z.string().trim().min(3, "Minimum 3 characters required").max(50, "Maximum 50 characters allowed").optional(),
    about: z.optional(z.string().trim().min(3, "Minimum 3 characters required").max(200, "Maximum 200 characters allowed")).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
}).strict().refine(
    (data) => {
        const { eventId, ...rest } = data;
        return Object.values(rest).some((value) => value !== undefined);
    },
    {
        message: "At least one field must be provided for update",
    }
);

export type CreateEventInputType = z.infer<typeof createEventSchema>;
export type UpdateEventInputType = z.infer<typeof updateEventSchema>;