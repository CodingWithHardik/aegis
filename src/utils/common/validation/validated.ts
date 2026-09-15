import { Context, SingletonBase } from "elysia";
import z, { ZodType } from "zod";
import { validate } from "../../../middleware/validate.middleware";
import { emptySingleton } from "../../../types/singleton";

export type ValidatedContext<
    S extends ZodType<any>,
    Singleton extends SingletonBase = typeof emptySingleton
> = Context<{ body: z.infer<S> }, Singleton>;

export const validated = <
    S extends ZodType<any>,
    Singleton extends SingletonBase = typeof emptySingleton
>(
    schema: S,
    handler: (ctx: ValidatedContext<S, Singleton>) => unknown,
    detail?: Record<string, unknown>
) => 
    [
        (ctx: Context) => handler(ctx as ValidatedContext<S, Singleton>),
        { body: schema, beforeHandle: validate(schema), detail: detail ?? {} },
    ] as const