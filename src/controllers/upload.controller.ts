import { NextFunction, Request, Response } from "express";
import * as uploadService from "../services/upload.service";


export const uploadImagesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files?.length) {
            return res.status(400).json({
                message : "At least one image is required"
            })
        };

        const urls = await uploadService.uploadImages(files);

        return res.status(200).json({ images : urls})

    } catch (error) {
        next(error)
    }
}