import { createCategoryController, listCategoriesController } from "@/controllers/category.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { createCategorySchema } from "@/types/product.types";
import { Router } from "express";

const router = Router();

router.get("/", listCategoriesController);
router.get("/", authenticate, authorize("admin"), validate(createCategorySchema), createCategoryController);

export default router;