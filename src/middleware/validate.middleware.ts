import type { Context } from "elysia";
import { ZodType } from "zod";
import { AppError } from "../utils/common/Errors/AppError";

type validateTarget = "body" | "params" | "query";

export const validate = 
    (schema: ZodType<any>, target: validateTarget = "body") =>
    (ctx: Context) => {
        const data = ctx[target] ?? {};
        const result = schema.safeParse(data);
        if (!result.success) {
            const errors = result.error.issues.map((error) => ({
                field: error.path.join(""),
                message: error.message
            }));
            throw new AppError(
                errors.map((error) => `${error.field}: ${error.message}`).join(", "),
                400,
            )
        }

        if (target === "body") {
            ctx.body = result.data;
        } else {
            (ctx as any).validated = {
                ...(ctx as any).validated,
                [target]: result.data
            }
        }
    }