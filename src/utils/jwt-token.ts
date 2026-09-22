import { config } from "@/config/env";
import { saveRefreshToken } from "@/repositories/auth.repository";
import { AuthPayload } from "@/types/auth.types";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// generate access token and add user information
export const generateAccessToken = (id: number, email : string, role: string) => {
    return jwt.sign(
        {id, email, role},
        config.jwtAccessSecret,
        {
            expiresIn : config.jwtAccessExpiresIn
        } as jwt.SignOptions
    );
};

// generate access token and add user information
export const generateRefreshToken = (id: number, email : string, role: string) => {
    return jwt.sign(
        {id, email, role},
        config.jwtRefreshExpiresIn,
        {
            expiresIn : config.jwtRefreshExpiresIn
        } as jwt.SignOptions
    );
};

// verify access token
export const verifyAccessToken = (token : string) => {
    return jwt.verify(
        token,
        config.jwtAccessSecret
    ) as AuthPayload;
}

// verify Refresh token
export const verifyRefreshToken = (token : string) => {
    return jwt.verify(
        token,
        config.jwtRefreshSecret
    ) as AuthPayload;
}

export const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export const issueTokens = async (id: number, email: string, role: string) => {
    const accessToken = generateAccessToken(id, email, role);
    const refreshToken = generateRefreshToken(id, email, role);

    const expiresAt = new Date(Date.now() + config.jwtRefreshExpiresDays * 24 * 60 * 60 * 1000);
    await saveRefreshToken(id, hashToken(refreshToken), expiresAt);

    return { accessToken, refreshToken};
}