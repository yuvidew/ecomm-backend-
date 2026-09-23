import { RowDataPacket } from "mysql2";
import z from "zod";

export interface CategoryRow extends RowDataPacket{
    id : number;
    name : string;
    slug : string;
    created_at : Date;
};

export interface ProductRow extends RowDataPacket {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string | null;
    price: string; // mysql2 returns DECIMAL as a string
    stock: number;
    created_at: Date;
    updated_at: Date;
};

export interface ProductImageRow extends RowDataPacket {
    id: number;
    product_id: number;
    url: string;
    sort_order: number;
}

// category schema
export const createCategorySchema = z.object({
    name : z.string().min(2, "Name must be at least 2 charachters")
});
export type createCategoryType = z.infer<typeof createCategorySchema>

// product schemas
export const createProductSchema = z.object({
    categoryId: z.number().int().positive(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    price: z.number().positive("Price must be greater than 0"),
    stock: z.number().int().min(0).default(0),
    images: z.array(z.string().url("Each image must be a valid URL")).optional().default([]),
});
export type CreateProductType = z.infer<typeof createProductSchema>

export const updateProductSchema = createProductSchema.partial();
export type UpdateProductType = z.infer<typeof updateProductSchema>;


// list query params (?page=&limit=&categoryId=&search=)
export const productQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    categoryId: z.coerce.number().int().positive().optional(),
    search: z.string().optional(),
});

export type ProductQueryType = z.infer<typeof productQuerySchema>

export interface ProductFilters {
    page: number;
    limit: number;
    categoryId?: number;
    search?: string;
}
