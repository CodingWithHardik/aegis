import type { AnyElysia } from "elysia";

export interface VersionGateOptions {
    prefix: string;
    plugin: AnyElysia;
    enabled: boolean;
    type: "PRODUCTION" | "TESTING" | "DEVELOPMENT";
}