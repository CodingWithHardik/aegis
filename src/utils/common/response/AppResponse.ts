import type { Context } from "elysia";
import type { ApiResponse } from "../../../types/types";

export const sendResponse = <T>(
    set: Context["set"],
    statusCode: number,
    payload?: ApiResponse<T>
) => {
    set.status = statusCode;
    return payload;
}