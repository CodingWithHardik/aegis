import Elysia from "elysia";
import { env } from "../../config/env.config";
import { versionRouteController } from "./version.controller";
import { versionGate } from "./version.gate";

const isDev = env.NODE_ENV === "development"
const isTesting = env.TESTING;
const isProd = env.NODE_ENV === "production"

export const versionManager = new Elysia()
.use(
    versionGate(
        { 
            prefix: "/v0", 
            plugin: versionRouteController, 
            enabled: isProd, 
            type: "PRODUCTION" 
        }
    )
)
.use(
    versionGate(
        { 
            prefix: "/v1", 
            plugin: versionRouteController, 
            enabled: isTesting, 
            type: "TESTING" 
        }
    )
)
.use(
    versionGate(
        { 
            prefix: "/v2", 
            plugin: versionRouteController, 
            enabled: isDev, 
            type: "DEVELOPMENT" 
        }
    )
);
