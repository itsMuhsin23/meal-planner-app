// ── Recipe ────────────────────────────────────────────────────────────────────
export interface Ingredient {
  name:     string;
  quantity: number;
  unit:     string;
}

export interface Recipe {
  _id:           string;
  name:          string;
  description:   string;
  imageUrl:      string | null;
  prepTime:      number;
  servings:      number;
  costPerServing:number;
  calories:      number;
  protein:       number;
  carbs:         number;
  fats:          number;
  category:      "breakfast" | "lunch" | "dinner" | "snack";
  dietaryTags:   string[];
  ingredients:   Ingredient[];
  instructions:  string;
  difficulty:    "easy" | "medium" | "hard";
}

// ── Meal Plan ─────────────────────────────────────────────────────────────────
export interface MealSnapshot {
  name:          string;
  calories:      number;
  costPerServing:number;
  protein:       number;
  carbs:         number;
  fats:          number;
  prepTime:      number;
  imageUrl:      string | null;
}

export interface MealItem {
  dayOfWeek: number;           // 1 = Monday … 7 = Sunday
  mealType:  MealType;
  recipe:    Recipe | null;    // populated by backend
  snapshot:  MealSnapshot;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface WeeklyTotals {
  cost:     number;
  calories: number;
  protein:  number;
  carbs:    number;
  fats:     number;
}

export interface MealPlanPreferences {
  dailyCalories:     number;
  dailyBudget:       number;
  dietaryPreference: string;
}

export interface MealPlan {
  _id:             string;
  preferences:     MealPlanPreferences;
  meals:           MealItem[];
  weeklyTotals:    WeeklyTotals;
  avgDailyCalories:number;
  avgDailyCost:    number;
  isActive:        boolean;
  createdAt:       string;
}

// ── Grouped by day (used in UI) ───────────────────────────────────────────────
export interface DayMeals {
  dayOfWeek: number;
  dayName:   string;
  breakfast: MealItem | undefined;
  lunch:     MealItem | undefined;
  dinner:    MealItem | undefined;
  snack:     MealItem | undefined;
  totalCal:  number;
  totalCost: number;
}

// ── Shopping list ─────────────────────────────────────────────────────────────
export interface ShoppingItem {
  name:       string;
  totalQty:   number;
  unit:       string;
  purchased:  boolean;
}
