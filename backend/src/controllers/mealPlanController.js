import {
  generateMealPlan,
  getLatestMealPlan,
  replaceMeal,
  getMealPlanStats
} from "../services/mealPlanService.js";

// ─── POST /api/meal-plan/generate ────────────────────────────────────────────
export const generate = async (req, res) => {
  try {
    const { dailyCalories, dailyBudget, dietaryPreference } = req.body;

    if (!dailyCalories || !dailyBudget) {
      return res.status(400).json({
        success: false,
        message: "dailyCalories and dailyBudget are required"
      });
    }

    const plan = await generateMealPlan({
      dailyCalories:    Number(dailyCalories),
      dailyBudget:      Number(dailyBudget),
      dietaryPreference: dietaryPreference || "none"
    });

    res.status(201).json({ success: true, data: plan });

  } catch (err) {
    console.error("generate error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── GET /api/meal-plan/latest ────────────────────────────────────────────────
export const getLatest = async (req, res) => {
  try {
    const plan = await getLatestMealPlan();
    res.status(200).json({ success: true, data: plan });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// ─── GET /api/meal-plan/:id/stats ────────────────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const plan = await getLatestMealPlan(); // reuse for now
    const stats = getMealPlanStats(plan);
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/meal-plan/:id/replace ──────────────────────────────────────────
export const replace = async (req, res) => {
  try {
    const { id }                  = req.params;
    const { dayOfWeek, mealType } = req.body;

    if (!dayOfWeek || !mealType) {
      return res.status(400).json({
        success: false,
        message: "dayOfWeek and mealType are required"
      });
    }

    const updatedPlan = await replaceMeal(id, dayOfWeek, mealType);
    res.status(200).json({ success: true, data: updatedPlan });

  } catch (err) {
    console.error("replace error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};
