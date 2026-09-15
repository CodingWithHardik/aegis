import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";
import { cors } from "@elysia/cors";
import { env } from "./config/env.config";
import { requestLogger } from "./middleware/request-logger.middleware";
import { globalRateLimiter } from "./middleware/rate-limit/global-rate-limit.middleware";
import { globalErrorHandler } from "./middleware/error.middleware";

export const app = new Elysia();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
      styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
      connectSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      workerSrc: ["'self'", "blob:"],
      upgradeInsecureRequests: env.NODE_ENV === "production" ? [] : null,
    }
  },
  hsts: env.NODE_ENV === "production", 
}));
app.use(backendInstance);
app.use(requestLogger);
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(globalErrorHandler);
app.use(
  openapi({
    path: "/docs",
    specPath: "/docs/json",
    documentation: {
      info: {
        title: "AEGIS DPSKMUN API",
        version: '1.0.0',
        description: "API docs for dpskmun backend"
      },
      tags: [
        { name: "Auth", description: "Authentication Endpoints" },
        { name: "Committee", description: "Committees Endpoint" },
        { name: "Event", description: "Event Endpoints" },
        { name: "Register", description: "Register Endpoints" },
        { name: "Team", description: "Team Endpoints" },
        { name: "Health", description: "Health Checks" },
      ]
    },
    mapJsonSchema: {
      zod: z.toJSONSchema,
    }
  })
)

const healthController = new HealthController();

app.get("/live", healthController.live);
app.get("/ready", healthController.ready);
app.get("/health", healthController.health);

app.use(globalRateLimiter)

import { backendInstance } from "./middleware/backend-instance.middleware";
import { HealthController } from "./modules/health-check/health.controller";
import { versionManager } from "./plugins/version/version.manager";
import z from "zod";
import { openapi } from "@elysiajs/openapi";

app.use(versionManager);