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

// Recipe statistics
router.get("/stats", getRecipeStats);

// Meal plan generation helper
router.get("/meal-plan", getRecipesForMealPlan);

// Bulk operations
router.post("/bulk", bulkCreateRecipes);

// Basic CRUD
router.post("/", createRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

// Filter by category
router.get("/category/:category", getRecipesByCategory);

// Filter by dietary preference
router.get("/diet/:diet", getRecipesByDiet);

export default router;