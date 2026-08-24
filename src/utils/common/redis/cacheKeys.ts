export const cacheKeys = {
    user: (userId: string) => `user:${userId}`,
    userByEmail: (email: string) => `user:email:${email}`,
    refreshToken: (token: string) => `refreshToken:${token}`,
    accessToken: (token: string) => `accessToken:${token}`,
}