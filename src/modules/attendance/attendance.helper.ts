const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export const toDateOnly = (date: Date): Date => {
    const shifted = new Date(date.getTime() + IST_OFFSET_MS);
    return new Date(Date.UTC(
        shifted.getUTCFullYear(),
        shifted.getUTCMonth(),
        shifted.getUTCDate(),
    ))
}