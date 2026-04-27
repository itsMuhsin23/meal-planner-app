import axios from "axios";
import { MealPlan } from "../types/models";

// 🔧 Change this to your machine's local IP when testing on a real device
// e.g. "http://192.168.1.50:5000"
// For Android emulator use: "http://10.0.2.2:5000"
const BASE_URL = "http://10.0.2.2:5000/api";

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

// ── Meal Plan ─────────────────────────────────────────────────────────────────
export const generateMealPlan = async (payload: {
  dailyCalories:     number;
  dailyBudget:       number;
  dietaryPreference: string;
}): Promise<MealPlan> => {
  const { data } = await api.post("/meal-plan/generate", payload);
  return data.data;
};

export const getLatestMealPlan = async (): Promise<MealPlan> => {
  const { data } = await api.get("/meal-plan/latest");
  return data.data;
};

export const replaceMeal = async (
  mealPlanId: string,
  dayOfWeek:  number,
  mealType:   string
): Promise<MealPlan> => {
  const { data } = await api.put(`/meal-plan/${mealPlanId}/replace`, { dayOfWeek, mealType });
  return data.data;
};
