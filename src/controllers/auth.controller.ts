import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";
import { REFRESH_COOKIE, refreshCookieOption } from "@/utils/cookie";

// sign up controller
export const signupController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.signup(req.body);

        return res.status(201).json(result);
    } catch (error) {
        next(error);
    };
};

// sign in controller
export const signinController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {accessToken, refreshToken, message} = await authService.signin(req.body);

        // passing the refresh token through the cookie
        res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOption)

        return res.status(201).json({message, accessToken});
    } catch (error) {
        next(error);
    };
};

// refresh access token controller
export const refreshController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.[REFRESH_COOKIE];

        if (!token) {
            return res.status(401).json({
                message : "No refresh token required"
            });
        };

        const { accessToken , refreshToken } = await authService.refreshAccessToken(token);

        res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOption)

        return res.status(200).json({
            accessToken
        })

    } catch (error) {
        next(error)
    }
};

// logout controller
export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.[REFRESH_COOKIE];

        if(token){
            await authService.logout(token);
        }

        res.clearCookie(REFRESH_COOKIE, { path : "/api/auth"})

        return res.status(200).json({
            message : "Logged ou successfully"
        })
    } catch (error) {
        next(error)
    }
}