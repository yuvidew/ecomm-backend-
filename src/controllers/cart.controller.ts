import { NextFunction, Request, Response } from "express";
import * as cartService from "@/services/cart.service";

// get the requester's cart
export const getCartController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await cartService.getCart(req.user!.id);
        return res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

// add a product to the cart
export const addToCartController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await cartService.addTocart(req.user!.id, req.body);
        return res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

// update a cart line's quantity
export const updateCartItemController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await cartService.updateCartItem(req.user!.id, Number(req.params.itemId), req.body);
        return res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

// remove a single line from the cart
export const removeCartItemController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await cartService.removeCartItem(req.user!.id, Number(req.params.itemId));
        return res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

// empty the cart
export const clearCartController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await cartService.clearCart(req.user!.id);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
