import { pool } from "@/config/db";
import * as categoryRepository from "@/repositories/category.repository";
import * as productRepository from "@/repositories/product.repository";
import { slugify } from "@/utils/slugify";
import products from "./products.data.json";

const seedProducts = async () => {
    for (const product of products) {
        const slug = slugify(product.name);

        const category = await categoryRepository.findCategoryById(product.category_id);

        if (!category) {
            console.log(`Skipped (category not found for id ${product.category_id}): ${product.name}`);
            continue;
        }

        const existing = await productRepository.findProductBySlug(slug);

        if (existing) {
            console.log(`Skipped (already exists): ${product.name}`);
            continue;
        }

        const productId = await productRepository.createProduct(
            category.id,
            product.name,
            slug,
            product.description ?? null,
            Number(product.price),
            product.stock
        );

        if (product.images?.length) {
            await productRepository.addProductImages(productId, product.images);
        }

        console.log(`Seeded: ${product.name}`);
    }
};

seedProducts()
    .then(() => {
        console.log("Product seeding complete");
    })
    .catch((error) => {
        console.error("Product seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });
