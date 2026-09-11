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
    handler: (ctx: ValidatedContext<S, Singleton>) => unknown
) => 
    [
        (ctx: Context) => handler(ctx as ValidatedContext<S, Singleton>),
        { beforeHandle: validate(schema) },
    ] as const