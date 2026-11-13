const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export const toDateOnly = (date: Date): Date => {
    const shifted = new Date(date.getTime() + IST_OFFSET_MS);
    return new Date(Date.UTC(
        shifted.getUTCFullYear(),
        shifted.getUTCMonth(),
        shifted.getUTCDate(),
    ))
}

export const eachDay = (start: Date, end: Date): Date[] => {
    const days: Date[] = [];
    const last = toDateOnly(end);
    for (let date = toDateOnly(start); date <= last; date = new Date(date.getTime() + 86400000)) {
        days.push(date);
    }
    return days;
}