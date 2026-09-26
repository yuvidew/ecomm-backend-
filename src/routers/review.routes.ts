import { Router } from "express";
import {
    createReviewController,
    deleteReviewController,
    getProductReviewsController,
    updateReviewController,
} from "@/controllers/review.controller";
import { createReviewSchema, updateReviewSchema } from "@/types/review.types";
import { validate } from "@/middlewares/validate.middleware";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

// public: anyone can read a product's reviews
router.get("/product/:productId", getProductReviewsController);

// authenticated: only logged-in users can write/edit/delete their own review
router.post("/", authenticate, validate(createReviewSchema), createReviewController);
router.put("/:id", authenticate, validate(updateReviewSchema), updateReviewController);
router.delete("/:id", authenticate, deleteReviewController);

export default router;
