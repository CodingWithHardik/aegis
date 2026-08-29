import { Context, SingletonBase } from "elysia";
import z, { ZodObject } from "zod";
import { validate } from "../../../middleware/validate.middleware";
import { emptySingleton } from "../../../types/emptySingleton";

export type ValidatedContext<
    S extends ZodObject<any>,
    Singleton extends SingletonBase = typeof emptySingleton
> = Context<{ body: z.infer<S> }, Singleton>;

export const validated = <
    S extends ZodObject<any>,
    Singleton extends SingletonBase = typeof emptySingleton
>(
    schema: S,
    handler: (ctx: ValidatedContext<S, Singleton>) => unknown
) => 
    [
        (ctx: Context) => handler(ctx as ValidatedContext<S, Singleton>),
        { beforeHandle: validate(schema) },
    ] as const