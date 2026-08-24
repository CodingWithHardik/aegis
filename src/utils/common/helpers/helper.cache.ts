export const ttlUntil = (expiresAt: Date, skewSeconds = 30): number => {
    const seconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000) - skewSeconds;
    return Math.max(0, seconds)
}