import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwt-token";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            message : "No token provided"
        });
    };

    const token = authHeader.split(" ")[1];

    try {
        const decode = verifyAccessToken(token);
        req.user = decode;

        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });

    }
}