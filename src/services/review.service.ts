import * as reviewRepository from "@/repositories/review.repository";
import * as productRepository from "@/repositories/product.repository";

// get products review serview
export const getProductReview = async (productId : number, page : number, limit: number) => {
    const product = await productRepository.findProductById(productId);

    if(!product){
        throw { status: 404, message: "Product not found" };
    }

    const offset = (page - 1)* limit;
    const [reviews, total] = await Promise.all([
        reviewRepository.findReviewByProduct(productId, limit, offset),
        reviewRepository.countReviewByProduct(productId)
    ]);

    return {
        reviews,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// add new review of the product
export const addReview = async (
    userId: number,
    productId: number,
    rating: number,
    comment?: string
) => {
    const product = await productRepository.findProductById(productId);
    if (!product) {
        throw { status: 404, message: "Product not found" };
    }

    const existing = await reviewRepository.findReviewByUserAndProduct(userId, productId);
    if (existing) {
        throw { status: 409, message: "You have already reviewed this product" };
    }

    const reviewId = await reviewRepository.createReview(userId, productId, rating, comment ?? null);
    await productRepository.recalculateProductRating(productId);
    return reviewRepository.findReviewById(reviewId);
};


// update reviews of the product
export const updateReview = async (
    userId: number,
    reviewId: number,
    rating?: number,
    comment? : string,
) => {
    const review = await reviewRepository.findReviewById(reviewId);

    if (!review) {
        throw { status: 404, message: "Review not found" };
    }
    if (review.user_id !== userId) {
        throw { status: 403, message: "You can only update your own review" };
    }

    await reviewRepository.updateReviewById(
        reviewId,
        rating ?? review.rating,
        comment ?? review.comment
    );

    await productRepository.recalculateProductRating(review.product_id);
    return reviewRepository.findReviewById(reviewId);
}


// delete review by id
export const deleteReview = async (
    userId: number,
    role: string,
    reviewId: number,
) => {
    const review = await reviewRepository.findReviewById(reviewId);

    if (!review) {
        throw { status: 404, message: "Review not found" };
    }
    if (review.user_id !== userId && role !== "admin") {
        throw { status: 403, message: "You can only delete your own review" };
    }

    await reviewRepository.deleteReviewByID(reviewId);
    await productRepository.recalculateProductRating(review.product_id);
};
