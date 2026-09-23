import { Router } from "express";
import {
    createProductcontroller,
    deleteProductByIdController,
    getProductByIdcontroller,
    listProductController,
    updateProductController,
} from "../controllers/product.controller";
import { createProductSchema, updateProductSchema } from "../types/product.types";
import { validate } from "@/middlewares/validate.middleware";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/role.middleware";

const router = Router();

router.get("/", listProductController);
router.get("/:id", getProductByIdcontroller);

router.post("/", authenticate, authorize("admin"), validate(createProductSchema), createProductcontroller);
router.put("/:id", authenticate, authorize("admin"), validate(updateProductSchema), updateProductController);
router.post("/:id", authenticate, authorize("admin"), deleteProductByIdController);

export default router;
