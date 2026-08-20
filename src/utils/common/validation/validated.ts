import { Context } from "elysia";
import z, { ZodObject } from "zod";
import { validate } from "../../../middleware/validate.middleware";

export type ValidatedContext<S extends ZodObject<any>> = Context & {
    body: z.infer<S>;
}

export const validated = <S extends ZodObject<any>>(
    schema: S,
    handler: (ctx: ValidatedContext<S>) => unknown
) => 
    [
        (ctx: Context) => handler(ctx as ValidatedContext<S>),
        { beforeHandle: validate(schema) },
    ] as const