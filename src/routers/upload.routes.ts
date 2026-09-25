import { Router } from "express";
import { uploadImageController, uploadImagesController } from "../controllers/upload.controller";
import { upload } from "@/middlewares/upload.middleware";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/role.middleware";

const router = Router();

// multiple images upload router
router.post(
    "/images",
    authenticate,
    authorize("admin"),
    upload.array("images", 10),
    uploadImagesController
)

// single image upload router
router.post(
    "/image",
    authenticate,
    authorize("admin"),
    upload.single("image"),
    uploadImageController
)

export default router;