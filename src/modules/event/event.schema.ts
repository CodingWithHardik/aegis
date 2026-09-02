import { z } from "zod";

export const createEventSchema = z
  .object({
    type: z.enum(["INTRA", "MAIN"]),
    name: z
      .string()
      .trim()
      .min(3, "Minimum 3 characters required")
      .max(50, "Maximum 50 characters allowed"),
    about: z.optional(
      z
        .string()
        .trim()
        .min(3, "Minimum 3 characters required")
        .max(200, "Maximum 200 characters allowed"),
    ),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .strict();

export const updateEventSchema = z
  .object({
    eventId: z.string().trim(),
    name: z
      .string()
      .trim()
      .min(3, "Minimum 3 characters required")
      .max(50, "Maximum 50 characters allowed")
      .optional(),
    about: z
      .optional(
        z
          .string()
          .trim()
          .min(3, "Minimum 3 characters required")
          .max(200, "Maximum 200 characters allowed"),
      )
      .optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .strict()
  .refine(
    (data) => {
      const { eventId, ...rest } = data;
      return Object.values(rest).some((value) => value !== undefined);
    },
    {
      message: "At least one field must be provided for update",
    },
  );

export const deleteEventSchema = z
  .object({
    eventId: z.string().trim(),
    reason: z
      .string()
      .trim()
      .min(3, "Minimum 3 characters required")
      .max(200, "Maximum 200 characters allowed"),
  })
  .strict();

export const getEventSchema = z.preprocess(
  (value) => value ?? {},
  z
    .object({
      eventId: z.string().trim().optional(),
      year: z
        .number()
        .int()
        .min(2025, "Year must be greater than or equal to 2025")
        .max(
          new Date().getFullYear(),
          `Year must be less than or equal to ${new Date().getFullYear()}`,
        )
        .optional(),
      type: z.enum(["INTRA", "MAIN"]).optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
      const hasEventId = data.eventId !== undefined;
      const hasYear = data.year !== undefined;
      const hasType = data.type !== undefined;

      const onlyEventId = hasEventId && !hasYear && !hasType;
      const yearAndType = !hasEventId && hasYear && hasType;
      const none = !hasEventId && !hasYear && !hasType;

      if (onlyEventId || yearAndType || none) {
        return;
      }

      if (hasEventId && (hasYear || hasType)) {
        ctx.addIssue({
          code: "custom",
          message: "Cannot provide eventId with year or type",
          path: hasYear ? ["year"] : ["type"],
        });
      } else if (hasYear && !hasType) {
        ctx.addIssue({
          code: "custom",
          message: "Both year and type must be provided together",
          path: ["type"],
        });
      } else if (hasType && !hasYear) {
        ctx.addIssue({
          code: "custom",
          message: "Both year and type must be provided together",
          path: ["year"],
        });
      }
    }),
);

export type CreateEventInputType = z.infer<typeof createEventSchema>;
export type UpdateEventInputType = z.infer<typeof updateEventSchema>;
export type DeleteEventInputType = z.infer<typeof deleteEventSchema>;
export type GetEventInputType = z.infer<typeof getEventSchema>;