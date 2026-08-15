import { Elysia } from "elysia";
import { env } from "../config/env.config";
import { logger } from "../config/logger";


export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean = true;

    constructor (message: string, statusCode: number = 500, status?: string) {
        super(message);
        this.statusCode = statusCode;
        this.status = status ?? (statusCode < 500 ? "FAIL" : "ERROR");
        Error.captureStackTrace?.(this, this.constructor);
    }
}

const BUILTIN: Record<string, { statusCode: number; message?: string }> = {
    VALIDATION: { statusCode: 422 },
    NOT_FOUND: { statusCode: 404, message: "Not Found" },
    PARSE: { statusCode: 400, message: "Invalid request body" },
    INVALID_COOKIE_SIGNATURE: { statusCode: 401, message: "Invalid cookie signature" },
    INVALID_FILE_TYPE: { statusCode: 422 },
}

export const globalErrorHandler = new Elysia({
    name : "global-error-handler"
})
.error({ APP_ERROR: AppError })
.onError(({ code, error, set, request }) => {
    const builtin = BUILTIN[code];

    const statusCode = 
        builtin?.statusCode ?? 
        (error as any).statusCode ??
        (error as any).status ??
        500;
    
    const message = 
        builtin?.message ??
        (error instanceof Error ? error.message : String(error));

    const status = 
        (error as any).status && typeof (error as any).status === "string"
            ?(error as any).status
            : statusCode < 500
                ? "FAIL"
                : "ERROR";
    
    const isOperational = (error as any).isOperational === true || builtin !== undefined;

    set.status = statusCode;
    
    if (env?.NODE_ENV === "development") {
        logger.error({
            code,
            message,
            stack: (error as Error).stack,
            path: request.url.slice(request.url.indexOf("/", 8)),
            error,
        })
        return {
            status,
            message,
            stack: (error as Error).stack,
            error,
        };
    }

    if (isOperational) {
        logger.error({ code, status, message });
        return { status, message };
    }

    logger.error({
        code,
        success: false,
        message: "Something went wrong",
        stack: (error as Error).stack,
        path: request.url.slice(request.url.indexOf("/", 8)),
    })

    set.status = 500;
    return { success: false, message: "Something went wrong" };
})
.as("global")