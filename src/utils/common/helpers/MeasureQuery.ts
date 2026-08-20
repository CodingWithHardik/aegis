import { performance } from "perf_hooks";
import { logger } from "../../../config/logger";

export const measureQuery = async <T>(
    operation: string,
    query: () => Promise<T>
): Promise<T> => {
    const start = performance.now();

    try {
        const result = await query();

        const duration = performance.now() - start;

        logger.info({
            event: "DB_QUERY",
            operation,
            durationMs: Number(duration.toFixed(2)),
        })

        return result;
    } catch (error) {
        const duration = performance.now() - start;

        logger.error({
            event: "DB_QUERY_ERROR",
            operation,
            durationMs: Number(duration.toFixed(2)),
            error: error instanceof Error ? error.message : "Unknown Error",
        })

        throw error;
    }
}