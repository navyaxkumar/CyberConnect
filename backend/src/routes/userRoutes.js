import { Router } from "express";
import { getMe, patchMe, getByUsername } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { updateProfileRules, publicUsernameRules } from "../validators/profileValidator.js";

const router = Router();

router.get("/me", protect, getMe);
router.patch("/me", protect, updateProfileRules, validateRequest, patchMe);
router.get("/:username", publicUsernameRules, validateRequest, getByUsername);

export default router;
