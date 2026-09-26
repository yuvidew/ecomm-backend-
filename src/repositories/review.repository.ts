import { pool } from "@/config/db";
import { ReviewRow, ReviewWithUserRow } from "@/types/review.types";
import { ResultSetHeader, RowDataPacket } from "mysql2";


// list reviews for a product, joined with reviwer name, newset first
export const findReviewByProduct = async (
    productId : number,
    limit : number,
    offset : number,
) : Promise<ReviewWithUserRow[]> => {
    const [rows] = await pool.query<ReviewWithUserRow[]>(
        `SELECT reviews.*, users.name
        FROM reviews
        JOIN users ON users.id = reviews.user_id
        WHERE reviews.product_id = ?
        ORDER BY reviews.created_at DESC
        LIMIT ? OFFSET ?
        `,
        [productId, limit, offset]
    );

    return rows;
};

// get total reviews by product
export const countReviewByProduct = async (productId : number) : Promise<number> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) As total From reviews WHERE product_id = ?",
        [productId]
    );

    return rows[0].total;

};

// get review by
export const findReviewById = async (id: number) : Promise<ReviewRow | null> => {
    const [rows] = await pool.query<ReviewRow[]>(
        "SELECT * FROM reviews WHERE id = ?",
        [id]
    );

    return rows[0] ?? null;
};

// get list by the user and product
export const findReviewByUserAndProduct = async(userId : number, productId : number) : Promise<ReviewRow | null> => {
    const [rows] = await pool.query<ReviewRow[]>(
        "SELECT * FROM reviews WHERE user_id = ? AND product_id = ?",
        [userId, productId]
    );

    return rows[0] ?? null;
};

// create  new product review
export const createReview = async (
    userId : number,
    productId : number,
    rating : number,
    comment : string | null
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)",
        [userId, productId, rating, comment]
    );

    return result.insertId;
};

// update review by id
export const updateReviewById = async (id : number, rating: number, comment: string | null): Promise<void> => {
    await pool.query(
        "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?",
        [rating, comment, id]
    );
};

// delete the review by id
export const deleteReviewByID = async (id : number) : Promise<void> => {
    await pool.query(
        "DELETE FROM reviews WHERE id = ?",
        [id]
    )
}