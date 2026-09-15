import { z } from "zod";

export const registerUserSchema = z.object({
    name: z.string().trim().min(3, "Minimum 3 characters required").max(50, "Maximum 50 characters allowed"),
    instution: z.string().trim().min(3, "Minimum 3 characters required").max(100, "Maximum 100 characters allowed").optional(),
    email: z.email().trim().toLowerCase(),
    password: z.string().trim().min(6, "Minimum 6 characters required").max(50, "Maximum 50 characters allowed"),
}).strict();

export const loginUserSchema = z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().trim().min(6, "Minimum 6 characters required").max(50, "Maximum 50 characters allowed"),
}).strict();

export const refreshAccessTokenSchema = z.object({
    userId: z.string().trim(),
    accessToken: z.string().trim(),
}).strict();

export const updateUserSchema = z.object({
    userId: z.string().trim(),
    name: z.string().trim().min(3, "Minimum 3 characters required").max(50, "Maximum 50 characters allowed").optional(),
    instution: z.string().trim().min(3, "Minimum 3 characters required").max(100, "Maximum 100 characters allowed").optional(),
    phoneNo: z.string().trim().min(10, "Minimum 10 characters required").max(15, "Maximum 15 characters allowed").optional(),
})

export type RegisterUserInputType = z.infer<typeof registerUserSchema>;
export type LoginUserInputType = z.infer<typeof loginUserSchema>;
export type RefreshTokenBodyType = z.infer<typeof refreshAccessTokenSchema>;
export type UpdateUserInputType = z.infer<typeof updateUserSchema>;