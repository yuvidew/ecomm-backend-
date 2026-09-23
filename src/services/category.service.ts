import { createCategoryType } from "@/types/product.types";
import * as categoryRepository from "../repositories/category.repository";
import { slugify } from "@/utils/slugify";

// listing all categories
export const listCategories = async () => {
    return categoryRepository.findAllCategories();
};

// create a category
export const createCategory = async (input: createCategoryType) => {
    const slug = slugify(input.name);

    const existing = await categoryRepository.findCategoryBySlug(slug);

    if (existing) {
        throw {
            status : 409,
            message : "Category alredy exists"
        }
    };

    const id = await categoryRepository.createCategory(input.name, slug);

    return {
        id,
        name : input.name,
        slug
    }
}

