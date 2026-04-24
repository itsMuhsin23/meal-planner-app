import express from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getRecipesByCategory,
  getRecipesByDiet,
  getRecipesForMealPlan,
  bulkCreateRecipes,
  getRecipeStats
} from "../controllers/recipeController.js";

const router = express.Router();

// ✅ Special routes FIRST
router.get("/stats", getRecipeStats);
router.get("/meal-plan", getRecipesForMealPlan);
router.post("/bulk", bulkCreateRecipes);

// ✅ Filters BEFORE dynamic :id
router.get("/category/:category", getRecipesByCategory);
router.get("/diet/:diet", getRecipesByDiet);

// ✅ Basic routes
router.post("/", createRecipe);
router.get("/", getRecipes);

// ❗ Dynamic routes ALWAYS LAST
router.get("/:id", getRecipeById);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;