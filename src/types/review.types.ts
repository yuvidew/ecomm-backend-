import { RowDataPacket } from "mysql2";
import z from "zod";

export interface ReviewRow extends RowDataPacket {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface ReviewWithUserRow extends ReviewRow {
    name : string
}

export const createReviewSchema = z.object({
    productId: z.number().int().positive(),
    rating : z.number().int().min(1, "Rating must be last 1").max(5, "Rating must be at most 5"),
    comment : z.string().max(1000, "Comment must be at most 1000 characters").optional(),
});

export type CreateReviewType = z.infer<typeof createReviewSchema>;

export const updateReviewSchema = z.object({
    rating : z.number().int().min(1).max(5).optional(),
    comment : z.string().max(1000).optional()
});

export type UpdateReviewType = z.infer<typeof updateReviewSchema>;

export const reviewQuerySchema = z.object({
    page : z.coerce.number().int().min(1).default(1),
    limit : z.coerce.number().int().min(1).max(100).default(10),
});

export type ReviewQueryType = z.infer<typeof reviewQuerySchema>