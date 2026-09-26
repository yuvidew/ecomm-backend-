import { Router } from "express";
import {
    addToCartController,
    clearCartController,
    getCartController,
    removeCartItemController,
    updateCartItemController,
} from "@/controllers/cart.controller";
import { addToCartSchema, updateCartItemSchema } from "@/types/cart.types";
import { validate } from "@/middlewares/validate.middleware";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getCartController);
router.post("/", validate(addToCartSchema), addToCartController);
router.put("/:itemId", validate(updateCartItemSchema), updateCartItemController);
router.delete("/:itemId", removeCartItemController);
router.delete("/", clearCartController);

export default router;
