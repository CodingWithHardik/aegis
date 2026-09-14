import z from "zod";

export const getCommitteeSchema = z.object({
    committeeId: z.string().trim().optional(),
    eventId: z.string().trim().optional(),
}).strict();

export const createCommitteeSchema = z.object({
    name: z.string().trim(),
    slug: z.string().trim(),
    agenda: z.string().trim(),
    about: z.string().trim().optional(),
    capacity: z.number().int().min(0),
    eventId: z.string().trim(),
}).strict();

export const updateCommitteeSchema = z.object({
    committeeId: z.string().trim(),
    name: z.string().trim().optional(),
    slug: z.string().trim().optional(),
    agenda: z.string().trim().optional(),
    about: z.string().trim().optional(),
    capacity: z.number().int().min(0).optional(),
}).strict();

export const deleteCommitteeSchema = z.object({
    committeeId: z.string().trim(),
}).strict();

export type GetCommitteeInputType = z.infer<typeof getCommitteeSchema>;
export type CreateCommitteeInputType = z.infer<typeof createCommitteeSchema>;
export type UpdateCommitteeInputType = z.infer<typeof updateCommitteeSchema>;
export type DeleteCommitteeInputType = z.infer<typeof deleteCommitteeSchema>;