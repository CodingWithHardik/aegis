import z, { ZodType } from "zod";

export type ValidateTarget = "body" | "query" | "params";

export type ValidateSchema = Partial<Record<ValidateTarget, ZodType<any>>>;

export type ValidateInferSchemas<T extends ValidateSchema> = {
    [K in keyof T]: T[K] extends ZodType<any> ? z.infer<T[K]> : never;
}