import { CreateProductType, ProductQueryType, ProductRow, UpdateProductType } from "@/types/product.types";
import * as productRepository from "../repositories/product.repository";
import * as categoryRepository from "../repositories/category.repository";
import { slugify } from "@/utils/slugify";

// attach images 
const attachImages = async (product: ProductRow) => {
    const images = await productRepository.findProductsImages(product.id);

    return { ...product, images: images?.map((img) => img.url)};
};

// listing products with images
export const listProduct = async (query : ProductQueryType) => {
    const { products , total } = await productRepository.findProduct(query);

    const withImages = await Promise.all(products.map(attachImages));

    return {
        products: withImages,
        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.ceil(total / query.limit),
        },
    };
}

// get products by id
export const getProductById = async (id : number) => {
    const product = await productRepository.findProductById(id);

    if (!product) {
        throw {
            status : 404,
            message : "Product not found"
        }
    };

    return attachImages(product);
};

// create product
export const createProduct = async (input: CreateProductType) => {
    const category = await categoryRepository.findCategoryById(input.categoryId);
    if (!category) {
        throw {
            status : 409,
            message: "Category does not exist",
        }
    };


    const slug = slugify(input.name);
    const existingProducts = await productRepository.findProductBySlug(slug);

    if (existingProducts) {
        throw {
            status : 409,
            message : "A product with this name already exist"
        }
    };

    const id = await productRepository.createProduct(
        input.categoryId,
        input.name,
        slug,
        input.description ?? null,
        input.price,
        input.stock
    );

    if (input.images?.length) {
        await productRepository.addProductImages(id, input.images)
    };

    return getProductById(id)
};

// update product
export const updateProduct  = async (id: number, input: UpdateProductType) => {
    const product = await productRepository.findProductById(id);

    if (!product) {
        throw {
            status : 404,
            message : "Product not found"
        }
    };

    if(input.categoryId){
        const category = await categoryRepository.findCategoryById(input.categoryId);

        if (!category) {
            throw {
                status : 400,
                message : "Category does not exist"
            }
        };
    };

    let slug: string | undefined;

    if (input.name) {
        slug = slugify(input.name);
        const existingProduct = await productRepository.findProductBySlug(slug);

        if (existingProduct && existingProduct.id !== id) {
            throw { status: 409, message: "A product with this name already exists" };
        }

    };

    await productRepository.updateProduct(id, {
        categoryId: input.categoryId,
        name: input.name,
        slug,
        description: input.description,
        price: input.price,
        stock: input.stock,
    });

    if (input.images){
        await productRepository.deleteProductImages(id);
        await productRepository.addProductImages(id, input.images);
    };

    return getProductById(id)
}

// delete product by id 
export const deleteProductById = async (id : number) => {
    const product = await productRepository.findProductById(id);

    if (!product) {
        throw {
            status : 404,
            message : "Product not found"
        };
    };

    await productRepository.deleteProduct(id);
    return {
        message : "Product deleted successfully"
    }
}