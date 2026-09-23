import { NextFunction, Request, Response } from "express";
import * as productService from "../services/product.service";
import { productQuerySchema } from "@/types/product.types";

// list product cantroller
export const listProductController = async (req : Request, res: Response, next: NextFunction) => {
    try {
        const parsed = productQuerySchema.safeParse(req.query);

        if(!parsed.success){
            return res.status(400).json({
                message: "Validation failed",
                errors: parsed.error.flatten().fieldErrors,
            });
        };

        const result = await productService.listProduct(parsed.data);

        return res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}

// get product by id cotroller
export const getProductByIdcontroller = async (req : Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.getProductById(Number(req.params.id));
        return res.status(200).json(product)
    } catch (error) {
        next(error)
    }
} 

// create product cotroller
export const createProductcontroller = async (req : Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.createProduct(req.body);
        return res.status(201).json(product)
    } catch (error) {
        next(error)
    }
}

// update product cotroller
export const updateProductController = async (req : Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.updateProduct(Number(req.params.id), req.body);
        return res.status(200).json(product)
    } catch (error) {
        next(error)
    }
}

// delete product by id cotroller
export const deleteProductByIdController = async (req : Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.deleteProductById(Number(req.params.id));
        return res.status(200).json(product)
    } catch (error) {
        next(error)
    }
} 