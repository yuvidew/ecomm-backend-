import { createCategoryType, UpdateCategoryType } from "@/types/product.types";
import * as categoryRepository from "../repositories/category.repository";
import { slugify } from "@/utils/slugify";

// get category by id
export const getCategoryById = async (id: number) => {
    const category = await categoryRepository.findCategoryById(id);

    if (!category) {
        throw {
            status : 404,
            message : "Category not found"
        }
    };
    return category;
}

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

    const id = await categoryRepository.createCategory(input.name, slug, input.image);

    return {
        id,
        name : input.name,
        slug,
        image : input.image
    }
};

// update a category by id
export const updateCategory = async (id: number, input : UpdateCategoryType) => {
    const existing = await categoryRepository.findCategoryById(id);

    if (!existing) {
        throw {
            status : 404,
            message : "Category not found"
        }
    };
    let slug: string | undefined;

    if (input.name) {
        slug = slugify(input.name);

        const existingCategory = await categoryRepository.findCategoryBySlug(slug);

        if (existingCategory && existingCategory.id !== id) {
            throw { status: 409, message: "A cateogry with this name already exists" };
        }
    };

    await categoryRepository.updateCategory(
        id,
        {
            slug,
            name : input.name,
            image : input.image
        }
    );

    return getCategoryById(id)

};

// delete category by id
export const deleteCategory = async (id : number) => {
    const existing = await categoryRepository.findCategoryById(id);

    if (!existing) {
        throw {
            status : 404,
            message : "Category not found"
        }
    };

    await categoryRepository.deleteCategory(id);

    return {
        message : "Category deleted successfully"
    }
}

