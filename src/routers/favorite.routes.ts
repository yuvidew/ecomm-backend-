import { Router } from "express";
import {
    addFavoriteController,
    getFavoritesController,
    removeFavoriteController,
} from "@/controllers/favorite.controller";
import { addFavoriteSchema } from "@/types/favorite.types";
import { validate } from "@/middlewares/validate.middleware";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getFavoritesController);
router.post("/", validate(addFavoriteSchema), addFavoriteController);
router.delete("/:productId", removeFavoriteController);

export default router;
