import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";
import { cors } from "@elysia/cors";
import { env } from "./config/env.config";
import { requestLogger } from "./middleware/request-logger.middleware";
import { globalRateLimiter } from "./middleware/rate-limit/global-rate-limit.middleware";
import { globalErrorHandler } from "./middleware/error.middleware";

export const app = new Elysia();

app.use(helmet());
app.use(backendInstance);
app.use(requestLogger);
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

const healthController = new HealthController();

app.get("/live", healthController.live);
app.get("/ready", healthController.ready);
app.get("/health", healthController.health);

app.use(globalRateLimiter)

import { backendInstance } from "./middleware/backend-instance.middleware";
import { HealthController } from "./modules/health-check/health.controller";

app.use(globalErrorHandler)
