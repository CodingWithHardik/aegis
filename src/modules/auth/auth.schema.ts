import { z } from "zod";

export const registerUserSchema = z.object({
    name: z.string().trim().min(3, "Minimum 3 characters required").max(50, "Maximum 50 characters allowed"),
    email: z.email().trim().toLowerCase(),
    password: z.string().trim().min(6, "Minimum 6 characters required").max(50, "Maximum 50 characters allowed"),
}).strict();

export const loginUserSchema = z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().trim().min(6, "Minimum 6 characters required").max(50, "Maximum 50 characters allowed"),
}).strict();

export type RegisterUserInputType = z.infer<typeof registerUserSchema>;
export type LoginUserInputType = z.infer<typeof loginUserSchema>;