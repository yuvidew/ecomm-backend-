import {
  createCategoryController,
  deleteCategoryController,
  listCategoriesController,
  updateCategoryController,
} from "@/controllers/category.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "@/types/product.types";
import { Router } from "express";

const router = Router();

router.get("/", listCategoriesController);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createCategorySchema),
  createCategoryController,
);
router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    validate(updateCategorySchema),
    updateCategoryController,
)

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteCategoryController,
)


export default router;
