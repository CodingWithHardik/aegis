import dotenv from "dotenv"
import fs from "fs";
import { envSchema } from "./env.schema"

let envFile = ".env"

if (process.env.NODE_ENV === "production" && fs.existsSync(".env.production")) {
    envFile = ".env.production"
} else if (process.env.NODE_ENV === "testing" && fs.existsSync(".env.testing")) {
    envFile = ".env.testing"
} else if (process.env.NODE_ENV === "development" && fs.existsSync(".env.development")) {
    envFile = ".env.development"
} else if (process.env.NODE_ENV === "development" && fs.existsSync(".env.local")) {
    envFile = ".env.local"
} else {
    envFile = ".env"
}

dotenv.config({ path: envFile })

import { z } from "zod";

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error(
        "Invalid environment variables: ",
        z.treeifyError(parsedEnv.error)
    )
    process.exit(1);
}

export const env = parsedEnv.data;