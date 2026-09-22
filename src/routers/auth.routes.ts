import { Router } from "express";
import { signupController, signinController, refreshController, logoutController } from "../controllers/auth.controller";
import { signupSchema, signinSchema } from "../types/auth.types";
import { validate } from "@/middlewares/validate.middleware";

const router = Router()

router.post("/sign-up", validate(signupSchema), signupController)
router.post("/sign-in", validate(signinSchema), signinController)
router.post("/refresh-token", refreshController)
router.post("/logout", logoutController)

export default router