import { pool } from "@/config/db";
import { ProductFilters, ProductImageRow, ProductRow } from "@/types/product.types";
import { ResultSetHeader, RowDataPacket } from "mysql2";


// find a product by the id
export const findProductById = async (id : number) : Promise<ProductRow | null> => {
    const [rows] = await pool.query<ProductRow[]>(
        "SELECT * FROM products WHERE id = ?",
        [id]
    );

    return rows[0] ?? null;
};

// find product by the slug
export const findProductBySlug = async (slug : string) : Promise<ProductRow | null> => {
    const [rows] = await pool.query<ProductRow[]>(
        "SELECT * FROM products WHERE slug = ?",
        [slug]
    );

    return rows[0] ?? null;
};

// find product images 
export const findProductsImages = async (productId: number) : Promise<ProductImageRow[] | null> => {
    const [rows] = await pool.query<ProductImageRow[]>(
        "SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC",
        [productId]
    );

    return rows;
};

// find products by page, limit, category, search
export const findProduct = async (filters: ProductFilters) : Promise<{products: ProductRow[]; total : number}> => {
    const { page, limit, categoryId, search} = filters;

    const offest = (page - 1) * limit;

    const canditions : string[] = [];
    const params : (string | number)[] = [];

    if(categoryId){
        canditions.push("category_id = ?");
        params.push(categoryId);
    }

    if (search) {
        canditions.push("name LIKE ?");
        params.push(`%${search}%`);
    }

    const whereClaus = canditions.length ? `WHERE ${canditions.join(" AND ")}` : "";

    const [rows] = await pool.query<ProductRow[]>(
        `SELECT * FROM products ${whereClaus} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...params, limit, offest]
    );

    const [countRows] = await pool.query<RowDataPacket[]>(
        `SELECT COUNT(*) as total FROM products ${whereClaus}`,
        params
    );

    return { products: rows, total: countRows[0].total as number}

};

// create new product
export const createProduct = async (
    categoryId: number,
    name: string,
    slug: string,
    description: string | null,
    price: number,
    stock: number
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO products (category_id, name, slug, description, price, stock) VALUES (?, ?, ?, ?, ?, ?)",
        [categoryId, name, slug, description, price, stock]
    );

    return result.insertId
};

// update product
export const updateProduct = async (
    id: number,
    fields : Partial<{
        categoryId: number;
        name: string;
        slug: string;
        description: string | null;
        price: number;
        stock: number;
    }>
): Promise<void> => {
    const columnMap : Record<string, string> = {
        categoryId: "category_id",
        name: "name",
        slug: "slug",
        description: "description",
        price: "price",
        stock: "stock",
    };

    const entries = Object.entries(fields).filter(([, value]) => value !== undefined);

    if(!entries.length) return;

    const setClause = entries.map(([key])  => `${columnMap[key]} = ?`).join(", ");
    const values = entries.map(([, value]) => value);

    await pool.query(
        `UPDATE products SET ${setClause} WHERE id = ?`,
        [...values, id]
    )
};

// delete product
export const deleteProduct = async (id : number): Promise<void> => {
    await pool.query(
        "DELETE FROM product WHERE id = ?",
        [id]
    );
};

// add product images
export const addProductImages = async (productId: number, urls : string[]) : Promise<void> => {
    if(!urls.length) return;

    const values = urls.map((url, index) => [productId, url, index]);
    await pool.query(
        "INSERT INTO product_images (product_id, url, sort_order) VALUES ?",
        [values]
    )
}

// delete product images
export const deleteProductImages = async (productId : number) : Promise<void> => {
    await pool.query(
        "DELETE FROM product_images WHERE product_id = ?",
        [productId]
    );
};