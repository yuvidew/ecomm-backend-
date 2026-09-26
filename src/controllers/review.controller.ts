import { NextFunction, Request, Response } from "express";
import * as reviewService from "@/services/review.service";
import { reviewQuerySchema } from "@/types/review.types";

export const getProductReviewsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = reviewQuerySchema.safeParse(req.query);
        if(!result.success){
            return res.status(400).json({
                message: "Validation Failed",
                errors : result.error.flatten().fieldErrors,
            })
        }

        const {page , limit} = result.data;
        const data = await reviewService.getProductReview(
            Number(req.params.productId),
            page,
            limit
        );

        return res.status(200).json(data);
    } catch (error) {
        next(error)
    }
}

export const createReviewController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const review = await reviewService.addReview(
            req.user!.id,
            req.body.productId,
            req.body.rating,
            req.body.comment
        );

        return res.status(201).json(review)
    } catch (error) {
        next(error);   
    }
}

export const updateReviewController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const review = await reviewService.updateReview(
            req.user!.id,
            Number(req.params.id),
            req.body.rating,
            req.body.comment
        );

        return res.status(200).json(review)
    } catch (error) {
        next(error);   
    }
}

export const deleteReviewController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await reviewService.deleteReview(
            req.user!.id,
            req.user!.role,
            Number(req.params.id)
        );
        return res.status(200).json({ message: "Review deleted successfully" });

    } catch (error) {
        next(error)
    }
}