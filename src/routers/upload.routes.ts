import { Router } from "express";
import { uploadImagesController } from "../controllers/upload.controller";
import { upload } from "@/middlewares/upload.middleware";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/role.middleware";

const router = Router();

router.post(
    "/images",
    authenticate,
    authorize("admin"),
    upload.array("images", 10),
    uploadImagesController
)

export default router;