import { NextFunction, Request, Response } from "express";
import * as favoriteService from "@/services/favorite.service";

// get the requester's favorites
export const getFavoritesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const favorites = await favoriteService.getFavorites(req.user!.id);
        return res.status(200).json(favorites);
    } catch (error) {
        next(error);
    }
};

// add a product to favorites
export const addFavoriteController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const favorites = await favoriteService.addFavorite(req.user!.id, req.body.productId);
        return res.status(200).json(favorites);
    } catch (error) {
        next(error);
    }
};

// remove a product from favorites
export const removeFavoriteController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const favorites = await favoriteService.removeFavorite(req.user!.id, Number(req.params.productId));
        return res.status(200).json(favorites);
    } catch (error) {
        next(error);
    }
};
