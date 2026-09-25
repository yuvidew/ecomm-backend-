import { pool } from "@/config/db";
import * as categoryRepository from "@/repositories/category.repository";
import { slugify } from "@/utils/slugify";
import categories from "./categories.data.json";

const seedCategories = async () => {
    for (const category of categories) {
        const slug = slugify(category.name);

        const existing = await categoryRepository.findCategoryBySlug(slug);

        if (existing) {
            console.log(`Skipped (already exists): ${category.name}`);
            continue;
        }

        await categoryRepository.createCategory(category.name, slug, category.image);
        console.log(`Seeded: ${category.name}`);
    }
};

seedCategories()
    .then(() => {
        console.log("Category seeding complete");
    })
    .catch((error) => {
        console.error("Category seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });
