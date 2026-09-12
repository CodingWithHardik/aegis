import { redis } from "../../../lib/redis";
import { logger } from "../../../config/logger";
import { measureQuery } from "./MeasureQuery";

type CacheOptions<T> = {
  key: string;
  ttl?: number | ((result: NonNullable<T>) => number);
};

export const cachedQuery = async <T>(
  operation: string,
  { key, ttl = 300 }: CacheOptions<T>,
  query: () => T | Promise<T>,
): Promise<T> => {
  try {
    const cached = await redis.get(key);
    if (cached !== null) {
      logger.info({ event: "CACHE_HIT", operation });
      return JSON.parse(cached) as T;
    }
    logger.info({ event: "CACHE_MISS", operation, key });
  } catch (error) {
    logger.warn({
      event: "CACHE_READ_ERROR",
      operation,
      key,
      error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
  const result = await measureQuery(operation, query);

  if (result !== null && result !== undefined) {
    const resolvedTtl =
      typeof ttl === "function" ? ttl(result as NonNullable<T>) : ttl;

    if (resolvedTtl > 0) {
      try {
        await redis.set(key, JSON.stringify(result), "EX", resolvedTtl);
      } catch (error) {
        logger.warn({
          event: "CACHE_WRITE_ERROR",
          operation,
          key,
          error: error instanceof Error ? error.message : "Unknown Error",
        });
      }
    } else {
      logger.info({
        event: "CACHE_SKIP_EXPIRED",
        operation,
      });
    }
  }
  return result;
};

export const invalidate = async (...keys: string[]): Promise<void> => {
  if (keys.length === 0) return;
  try {
    const literalKeys: string[] = [];
    const pattern: string[] = [];

    for (const key of keys) {
      if (key.includes("*")) {
        pattern.push(key);
      } else {
        literalKeys.push(key);
      }
    }

    const scannedKeys = await Promise.all(pattern.map(scanKeys))
    const resolvedKeys = scannedKeys.flat();

    const allKeys = [...literalKeys, ...resolvedKeys];

    if (allKeys.length === 0) {
      logger.info({ event: "CACHE_INVALIDATE_NO_KEYS", keys, resolved: [] });
      return;
    }

    await redis.del(...allKeys);
    logger.info({ event: "CACHE_INVALIDATE", keys, resolved: allKeys });
  } catch (error) {
    logger.warn({
      event: "CACHE_INVALIDATE_ERROR",
      keys,
      error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};

const scanKeys = async (pattern: string): Promise<string[]> => {
  const found: string[] = [];
  let cursor = "0";

  do {
    const [nextCursor, batch] = await redis.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      100,
    );
    cursor = nextCursor;
    found.push(...batch);
  } while (cursor !== "0");
  return found;
}
