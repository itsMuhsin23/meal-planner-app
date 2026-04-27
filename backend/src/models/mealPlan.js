import mongoose from "mongoose";

// ─── Meal Item (one meal in a day) ───────────────────────────────────────────
const mealItemSchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: true,
    min: 1, // 1 = Monday
    max: 7  // 7 = Sunday
  },
  mealType: {
    type: String,
    required: true,
    enum: ["breakfast", "lunch", "dinner", "snack"]
  },
  // Reference to Recipe
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true
  },
  // Snapshot of recipe data at generation time
  snapshot: {
    name:          { type: String, required: true },
    calories:      { type: Number, required: true },
    costPerServing:{ type: Number, required: true },
    protein:       { type: Number, default: 0 },
    carbs:         { type: Number, default: 0 },
    fats:          { type: Number, default: 0 },
    prepTime:      { type: Number, default: 0 },
    imageUrl:      { type: String, default: null }
  }
}, { _id: false });

// ─── Meal Plan ────────────────────────────────────────────────────────────────
const mealPlanSchema = new mongoose.Schema({
  preferences: {
    dailyCalories: {
      type: Number,
      required: true,
      min: [1200, "Minimum 1200 calories"],
      max: [5000, "Maximum 5000 calories"]
    },
    dailyBudget: {
      type: Number,
      required: true,
      min: [5,   "Minimum $5/day"],
      max: [100, "Maximum $100/day"]
    },
    dietaryPreference: {
      type: String,
      enum: ["none", "vegetarian", "vegan", "gluten-free", "dairy-free", "keto", "paleo"],
      default: "none"
    }
  },
  meals: {
    type: [mealItemSchema],
    validate: {
      validator: (v) => v && v.length === 28,
      message: "Meal plan must have exactly 28 meals (7 days x 4 meals)"
    }
  },
  weeklyTotals: {
    cost:     { type: Number, required: true },
    calories: { type: Number, required: true },
    protein:  { type: Number, default: 0 },
    carbs:    { type: Number, default: 0 },
    fats:     { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON:   { virtuals: true },
  toObject: { virtuals: true }
});

mealPlanSchema.virtual("avgDailyCalories").get(function () {
  return Math.round(this.weeklyTotals.calories / 7);
});

mealPlanSchema.virtual("avgDailyCost").get(function () {
  return parseFloat((this.weeklyTotals.cost / 7).toFixed(2));
});

mealPlanSchema.methods.getMealsForDay = function (dayOfWeek) {
  return this.meals.filter((m) => m.dayOfWeek === dayOfWeek);
};

mealPlanSchema.methods.getDailyTotals = function (dayOfWeek) {
  const dayMeals = this.getMealsForDay(dayOfWeek);
  return {
    dayOfWeek,
    calories: dayMeals.reduce((s, m) => s + m.snapshot.calories,       0),
    cost:     dayMeals.reduce((s, m) => s + m.snapshot.costPerServing,  0),
    protein:  dayMeals.reduce((s, m) => s + m.snapshot.protein,         0),
    carbs:    dayMeals.reduce((s, m) => s + m.snapshot.carbs,           0),
    fats:     dayMeals.reduce((s, m) => s + m.snapshot.fats,            0)
  };
};

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);
export default MealPlan;
