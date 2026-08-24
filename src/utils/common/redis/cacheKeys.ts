export const cacheKeys = {
    user: (userId: string) => `user:${userId}`,
    userByEmail: (email: string) => `user:email:${email}`,
    accessToken: (token: string) => `accessToken:${token}`,
}