import { Router } from "express";
import { register, login, logout, me } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { registerRules, loginRules } from "../validators/authValidator.js";

const router = Router();

router.post("/register", authLimiter, registerRules, validateRequest, register);
router.post("/login", authLimiter, loginRules, validateRequest, login);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;