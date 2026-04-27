import { create } from "zustand";
import { MealPlan, MealPlanPreferences, ShoppingItem } from "../types/models";
import { generateMealPlan, getLatestMealPlan, replaceMeal } from "../services/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
const DAY_NAMES = ["", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export const groupByDay = (plan: MealPlan) =>
  Array.from({ length: 7 }, (_, i) => {
    const day   = i + 1;
    const meals = plan.meals.filter((m) => m.dayOfWeek === day);
    return {
      dayOfWeek: day,
      dayName:   DAY_NAMES[day],
      breakfast: meals.find((m) => m.mealType === "breakfast"),
      lunch:     meals.find((m) => m.mealType === "lunch"),
      dinner:    meals.find((m) => m.mealType === "dinner"),
      snack:     meals.find((m) => m.mealType === "snack"),
      totalCal:  meals.reduce((s, m) => s + m.snapshot.calories,       0),
      totalCost: meals.reduce((s, m) => s + m.snapshot.costPerServing,  0)
    };
  });

export const buildShoppingList = (plan: MealPlan): ShoppingItem[] => {
  const map: Record<string, ShoppingItem> = {};

  plan.meals.forEach((meal) => {
    const recipe = meal.recipe;
    if (!recipe || !recipe.ingredients) return;
    recipe.ingredients.forEach((ing) => {
      const key = `${ing.name}-${ing.unit}`;
      if (map[key]) {
        map[key].totalQty += ing.quantity;
      } else {
        map[key] = { name: ing.name, totalQty: ing.quantity, unit: ing.unit, purchased: false };
      }
    });
  });

  return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
};

// ── Store ─────────────────────────────────────────────────────────────────────
interface StoreState {
  mealPlan:     MealPlan | null;
  shopping:     ShoppingItem[];
  loading:      boolean;
  error:        string | null;

  fetchLatest:     ()                                              => Promise<void>;
  generate:        (prefs: MealPlanPreferences)                   => Promise<void>;
  swapMeal:        (planId: string, day: number, type: string)    => Promise<void>;
  togglePurchased: (index: number)                                => void;
  clearError:      ()                                              => void;
}

export const useStore = create<StoreState>((set, get) => ({
  mealPlan: null,
  shopping: [],
  loading:  false,
  error:    null,

  fetchLatest: async () => {
    set({ loading: true, error: null });
    try {
      const plan = await getLatestMealPlan();
      set({ mealPlan: plan, shopping: buildShoppingList(plan), loading: false });
    } catch {
      set({ error: "No meal plan found. Create one first.", loading: false });
    }
  },

  generate: async (prefs) => {
    set({ loading: true, error: null });
    try {
      const plan = await generateMealPlan(prefs);
      set({ mealPlan: plan, shopping: buildShoppingList(plan), loading: false });
    } catch (e: any) {
      set({ error: e?.response?.data?.message || "Failed to generate plan.", loading: false });
    }
  },

  swapMeal: async (planId, day, type) => {
    set({ loading: true, error: null });
    try {
      const plan = await replaceMeal(planId, day, type);
      set({ mealPlan: plan, shopping: buildShoppingList(plan), loading: false });
    } catch (e: any) {
      set({ error: e?.response?.data?.message || "Failed to swap meal.", loading: false });
    }
  },

  togglePurchased: (index) => {
    const shopping = [...get().shopping];
    shopping[index] = { ...shopping[index], purchased: !shopping[index].purchased };
    set({ shopping });
  },

  clearError: () => set({ error: null })
}));
