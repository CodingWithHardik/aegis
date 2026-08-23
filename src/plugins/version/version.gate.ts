import Elysia from "elysia"; 
import { VersionGateOptions } from "./version.types";
import { AppError } from "../../middleware/error.middleware";

export function versionGate({ prefix, plugin, enabled, type }: VersionGateOptions) {
    if (enabled)
        return new Elysia({ prefix })
            .use(plugin)
            .decorate("versionType", { type });

    return new Elysia({ prefix })
        .all("/*", () => {
            throw new AppError("This version is currently disabled", 503);
        })
}