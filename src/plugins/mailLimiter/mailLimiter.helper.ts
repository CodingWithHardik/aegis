export class DailyLimitError extends Error {
    constructor() {
        super("SES daily sending quota is used up")
        this.name = "DailyLimitError"
    }
}

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))