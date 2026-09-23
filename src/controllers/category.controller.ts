import { NextFunction, Request, Response } from "express";
import * as categoryService from "../services/category.service";


//  lising cetegories controller
export const listCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoryService.listCategories();
        return res.status(200).json({categories})
    } catch (error) {
        next(error)
    }
}

// create category controller
export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await categoryService.createCategory(req.body);
        return res.status(200).json(category)
    } catch (error) {
        next(error)
    }
}