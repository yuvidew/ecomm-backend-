import { pool } from "@/config/db";
import { CategoryRow } from "@/types/product.types";
import { ResultSetHeader } from "mysql2";

// find all category
export const findAllCategories = async () : Promise<CategoryRow[]> => {
    const [rows] = await pool.query<CategoryRow[]>(
        "SELECT * FROM categories ORDER BY name ASC",
    );

    return rows
};

// find category by id
export const findCategoryById = async (id : number) : Promise<CategoryRow | null> => {
    const [rows] = await pool.query<CategoryRow[]>(
        "SELECT * FROM categories WHERE id = ?",
        [id]
    );

    return rows[0] ?? null;
};

// find category by slug
export const findCategoryBySlug = async (slug : string) : Promise<CategoryRow | null> => {
    const [rows] = await pool.query<CategoryRow[]>(
        "SELECT * FROM categories WHERE slug = ?",
        [slug]
    );

    return rows[0] ?? null;
};

// create cetegory
export const createCategory = async (name: string, slug: string) : Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO categories (name, slug) VALUES (?, ?)",
        [name, slug]
    );

    return result.insertId;
}