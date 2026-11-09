import { Context, SingletonBase } from "elysia";
import z, { ZodType } from "zod";
import { validate } from "../../../middleware/validate.middleware";
import { emptySingleton } from "../../../types/singleton";
import { ValidateInferSchemas, ValidateSchema, ValidateTarget } from "../../../types/validate";

export type ValidatedContext<
    T extends ValidateSchema,
    Singleton extends SingletonBase = typeof emptySingleton
> = Context<ValidateInferSchemas<T>, Singleton>;

export type ValidatedBodyContext<
    S extends ZodType<any>,
    Singleton extends SingletonBase = typeof emptySingleton
> = Context<{ body: z.infer<S> }, Singleton>;

export function validated<
    S extends ZodType<any>,
    Singleton extends SingletonBase = typeof emptySingleton
>(
    schema: S,
    handler: (ctx: ValidatedBodyContext<S, Singleton>) => unknown,
    detail?: Record<string, unknown>
): readonly [
    (ctx: Context) => unknown,
    { body: S; beforeHandle: ReturnType<typeof validate>[]; detail: Record<string, unknown> }
]

export function validated<
    T extends ValidateSchema,
    Singleton extends SingletonBase = typeof emptySingleton
>(
    schemas: T,
    handler: (ctx: ValidatedContext<T, Singleton>) => unknown,
    detail?: Record<string, unknown>
): readonly [
    (ctx: Context) => unknown,
    T & { beforeHandle: ReturnType<typeof validate>[]; detail: Record<string, unknown> }
]

export function validated(
    input: ZodType<any> | ValidateSchema,
    handler: (ctx: any) => unknown,
    detail?: Record<string, unknown>
) {
    const schemas: ValidateSchema = input instanceof ZodType ? { body: input } : input;

    const beforeHandle = (Object.entries(schemas) as [ValidateTarget, ZodType<any>][])
        .filter(([, schema]) => !!schema)
        .map(([target, schema]) => validate(schema, target));
    
    return [
        (ctx: Context) => handler(ctx),
        { ...schemas, beforeHandle, detail: detail ?? {} }
    ] as const;
}