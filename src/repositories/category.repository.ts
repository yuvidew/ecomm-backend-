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
export const createCategory = async (name: string, slug: string, image: string) : Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)",
        [name, slug, image]
    );

    return result.insertId;
};

// update the category
export const updateCategory = async (
    id : number,
    fields : Partial<{
       name: string, 
       slug: string, 
       image: string 
    }>
): Promise<void> => {
    const entries = Object.entries(fields).filter(([, value]) => value !== undefined);

    if(!entries.length) return;

    const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
    const values = entries.map(([, value]) => value)

    await pool.query(
        `UPDATE categories SET ${setClause} WHERE id = ?`,
        [...values, id]
    )
};

// delete category
export const deleteCategory = async (id: number) : Promise<void> => {
    await pool.query(
        "DELETE FROM categories WHERE id = ?",
        [id]
    )
}