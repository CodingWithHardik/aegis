import type { Context } from "elysia";

export const catchAsync = <T extends Context, R>(
    fn: (ctx: T) => Promise<R>,
) => {
    return async (ctx: T) => {
        try {
            return await fn(ctx)
        } catch (error) {
            throw error;
        }
    }
}