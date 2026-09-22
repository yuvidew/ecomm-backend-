import { config } from "@/config/env";

export const REFRESH_COOKIE = "refreshToken";

export const refreshCookieOption = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict" as const,
    path: "/api/auth",
    maxAge: config.jwtRefreshExpiresDays * 24 * 60 * 60 * 1000,
}