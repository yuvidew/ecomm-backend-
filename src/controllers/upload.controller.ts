import { NextFunction, Request, Response } from "express";
import * as uploadService from "../services/upload.service";

// upload multiples images controller
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

// upload single image controller
export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file as Express.Multer.File;

        if (!file) {
            return res.status(400).json({
                message : "An image is required"
            })
        };

        const urls = await uploadService.uploadImage(file);

        return res.status(200).json({ images : urls})

    } catch (error) {
        next(error)
    }
}