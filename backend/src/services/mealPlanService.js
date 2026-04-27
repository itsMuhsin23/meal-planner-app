import Recipe from "../models/recipe.js";
import MealPlan from "../models/mealPlan.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const BUDGET_SPLIT = {
  breakfast: 0.20,
  lunch:     0.35,
  dinner:    0.40,
  snack:     0.05
};

const CALORIE_SPLIT = {
  breakfast: 0.25,
  lunch:     0.35,
  dinner:    0.35,
  snack:     0.05
};

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

// ─── Scoring Algorithm ────────────────────────────────────────────────────────

/**
 * Score a recipe against targets.
 * LOWER score = BETTER match.
 *
 * Weights:
 *   70% calorie accuracy  (most important for health goals)
 *   30% cost accuracy     (important for budget)
 */
const scoreRecipe = (recipe, targetCalories, targetCost) => {
  const calorieDiff = Math.abs(recipe.calories      - targetCalories);
  const costDiff    = Math.abs(recipe.costPerServing - targetCost);

  // Normalise to avoid unit bias
  const calorieError = calorieDiff / targetCalories;
  const costError    = costDiff    / (targetCost || 1);

  return calorieError * 0.7 + costError * 0.3;
};

// ─── Recipe Selector ──────────────────────────────────────────────────────────

/**
 * Fetch candidates from DB then rank them intelligently.
 * Falls back to looser constraints if nothing is found.
 */
const pickBestRecipe = async (mealType, targetCalories, maxCost, dietaryPreference, usedIds) => {
  const buildFilter = (tight) => {
    const f = {
      category:      mealType,
      isActive:      true,
      costPerServing:{ $lte: tight ? maxCost : maxCost * 1.5 }
    };

    if (tight) {
      f.calories = {
        $gte: Math.round(targetCalories * 0.75),
        $lte: Math.round(targetCalories * 1.25)
      };
    }

    if (dietaryPreference && dietaryPreference !== "none") {
      f.dietaryTags = dietaryPreference;
    }

    // Avoid repeating recipes used in the same plan (variety)
    if (usedIds.size > 0) {
      f._id = { $nin: [...usedIds] };
    }

    return f;
  };

  // 1st try — strict filter with variety constraint
  let candidates = await Recipe.find(buildFilter(true));

  // 2nd try — relax calorie window, allow variety constraint
  if (!candidates.length) {
    candidates = await Recipe.find(buildFilter(false));
  }

  // 3rd try — relax everything (including variety) so we always return something
  if (!candidates.length) {
    const fallback = { category: mealType, isActive: true };
    if (dietaryPreference && dietaryPreference !== "none") {
      fallback.dietaryTags = dietaryPreference;
    }
    candidates = await Recipe.find(fallback);
  }

  if (!candidates.length) {
    throw new Error(`No ${mealType} recipes found. Please seed more data.`);
  }

  // Score all candidates and return the best
  const scored = candidates
    .map((r) => ({ recipe: r, score: scoreRecipe(r, targetCalories, maxCost) }))
    .sort((a, b) => a.score - b.score);

  return scored[0].recipe;
};

// ─── Main Generator ───────────────────────────────────────────────────────────

/**
 * Generate a 7-day meal plan.
 *
 * @param {Object} params
 * @param {number} params.dailyCalories
 * @param {number} params.dailyBudget
 * @param {string} params.dietaryPreference
 * @returns {Object} saved MealPlan document
 */
export const generateMealPlan = async ({
  dailyCalories,
  dailyBudget,
  dietaryPreference = "none"
}) => {
  // ── Validate ────────────────────────────────────────────────────────────────
  if (!dailyCalories || dailyCalories < 1200 || dailyCalories > 5000) {
    throw new Error("dailyCalories must be between 1200 and 5000");
  }
  if (!dailyBudget || dailyBudget < 5 || dailyBudget > 100) {
    throw new Error("dailyBudget must be between $5 and $100");
  }

  // ── Pre-compute per-meal targets ────────────────────────────────────────────
  const targets = {};
  for (const type of MEAL_TYPES) {
    targets[type] = {
      calories: Math.round(dailyCalories * CALORIE_SPLIT[type]),
      budget:   parseFloat((dailyBudget  * BUDGET_SPLIT[type]).toFixed(2))
    };
  }

  // ── Build 28 meals ──────────────────────────────────────────────────────────
  const meals   = [];
  const usedIds = new Set();

  // Running totals
  let totalCost = 0, totalCalories = 0;
  let totalProtein = 0, totalCarbs = 0, totalFats = 0;

  for (let day = 1; day <= 7; day++) {
    for (const type of MEAL_TYPES) {
      const { calories, budget } = targets[type];

      const recipe = await pickBestRecipe(
        type, calories, budget, dietaryPreference, usedIds
      );

      usedIds.add(recipe._id.toString());

      meals.push({
        dayOfWeek: day,
        mealType:  type,
        recipe:    recipe._id,
        snapshot: {
          name:          recipe.name,
          calories:      recipe.calories,
          costPerServing:recipe.costPerServing,
          protein:       recipe.protein,
          carbs:         recipe.carbs,
          fats:          recipe.fats,
          prepTime:      recipe.prepTime,
          imageUrl:      recipe.imageUrl ?? null
        }
      });

      totalCost     += recipe.costPerServing;
      totalCalories += recipe.calories;
      totalProtein  += recipe.protein;
      totalCarbs    += recipe.carbs;
      totalFats     += recipe.fats;
    }
  }

  // ── Save ────────────────────────────────────────────────────────────────────
  const mealPlan = await MealPlan.create({
    preferences: { dailyCalories, dailyBudget, dietaryPreference },
    meals,
    weeklyTotals: {
      cost:     parseFloat(totalCost.toFixed(2)),
      calories: Math.round(totalCalories),
      protein:  parseFloat(totalProtein.toFixed(1)),
      carbs:    parseFloat(totalCarbs.toFixed(1)),
      fats:     parseFloat(totalFats.toFixed(1))
    }
  });

  return mealPlan;
};

// ─── Get Latest Plan ──────────────────────────────────────────────────────────

export const getLatestMealPlan = async () => {
  const plan = await MealPlan
    .findOne({ isActive: true })
    .sort({ createdAt: -1 })
    .populate("meals.recipe", "name imageUrl prepTime difficulty ingredients instructions");

  if (!plan) throw new Error("No active meal plan found. Generate one first.");
  return plan;
};

// ─── Replace Single Meal ──────────────────────────────────────────────────────

export const replaceMeal = async (mealPlanId, dayOfWeek, mealType) => {
  const plan = await MealPlan.findById(mealPlanId);
  if (!plan) throw new Error("Meal plan not found");

  const idx = plan.meals.findIndex(
    (m) => m.dayOfWeek === Number(dayOfWeek) && m.mealType === mealType
  );
  if (idx === -1) throw new Error("Meal not found in plan");

  const { dailyCalories, dailyBudget, dietaryPreference } = plan.preferences;

  // Exclude ALL current recipe IDs for variety (except the one being replaced)
  const currentIds = new Set(
    plan.meals
      .filter((_, i) => i !== idx)
      .map((m) => m.recipe.toString())
  );

  const target = {
    calories: Math.round(dailyCalories * CALORIE_SPLIT[mealType]),
    budget:   dailyBudget * BUDGET_SPLIT[mealType]
  };

  const newRecipe = await pickBestRecipe(
    mealType, target.calories, target.budget, dietaryPreference, currentIds
  );

  // Adjust running totals
  const old = plan.meals[idx].snapshot;
  plan.weeklyTotals.cost     += newRecipe.costPerServing - old.costPerServing;
  plan.weeklyTotals.calories += newRecipe.calories       - old.calories;
  plan.weeklyTotals.protein  += newRecipe.protein        - old.protein;
  plan.weeklyTotals.carbs    += newRecipe.carbs          - old.carbs;
  plan.weeklyTotals.fats     += newRecipe.fats           - old.fats;

  // Swap the meal
  plan.meals[idx] = {
    dayOfWeek: Number(dayOfWeek),
    mealType,
    recipe: newRecipe._id,
    snapshot: {
      name:          newRecipe.name,
      calories:      newRecipe.calories,
      costPerServing:newRecipe.costPerServing,
      protein:       newRecipe.protein,
      carbs:         newRecipe.carbs,
      fats:          newRecipe.fats,
      prepTime:      newRecipe.prepTime,
      imageUrl:      newRecipe.imageUrl ?? null
    }
  };

  plan.markModified("meals");
  plan.markModified("weeklyTotals");
  await plan.save();

  return plan;
};

// ─── Stats helper ─────────────────────────────────────────────────────────────

export const getMealPlanStats = (plan) => {
  const DAY_NAMES = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const daily = Array.from({ length: 7 }, (_, i) => {
    const totals = plan.getDailyTotals(i + 1);
    return { ...totals, dayName: DAY_NAMES[i + 1] };
  });

  return {
    weekly: {
      ...plan.weeklyTotals,
      avgDailyCalories: plan.avgDailyCalories,
      avgDailyCost:     plan.avgDailyCost
    },
    daily
  };
};
