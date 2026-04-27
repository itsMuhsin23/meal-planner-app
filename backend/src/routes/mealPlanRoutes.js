import express from "express";
import { generate, getLatest, getStats, replace } from "../controllers/mealPlanController.js";

const router = express.Router();

// POST   /api/meal-plan/generate      → generate new plan
// GET    /api/meal-plan/latest        → get most recent plan
// GET    /api/meal-plan/:id/stats     → stats for a plan
// PUT    /api/meal-plan/:id/replace   → swap one meal

router.post("/generate",        generate);
router.get("/latest",           getLatest);
router.get("/:id/stats",        getStats);
router.put("/:id/replace",      replace);

export default router;
