import Recipe from "../models/recipe.js";

const sampleRecipes = [
  {
    name: "Banana Oatmeal",
    description: "Quick and healthy breakfast with oats and banana",
    prepTime: 5,
    servings: 1,
    costPerServing: 0.50,
    calories: 300,
    protein: 8,
    carbs: 54,
    fats: 5,
    category: "breakfast",
    dietaryTags: ["vegetarian", "vegan"],
    ingredients: [
      { name: "Oats", quantity: 50, unit: "grams" },
      { name: "Banana", quantity: 1, unit: "piece" },
      { name: "Almond milk", quantity: 200, unit: "ml" }
    ],
    instructions: "1. Boil water or milk. 2. Add oats and cook for 3 minutes. 3. Slice banana on top. 4. Enjoy!",
    difficulty: "easy"
  },
  {
    name: "Chicken Rice Bowl",
    description: "Protein-packed lunch with grilled chicken and brown rice",
    prepTime: 25,
    servings: 1,
    costPerServing: 3.50,
    calories: 550,
    protein: 45,
    carbs: 60,
    fats: 12,
    category: "lunch",
    dietaryTags: ["high-protein"],
    ingredients: [
      { name: "Chicken breast", quantity: 150, unit: "grams" },
      { name: "Brown rice", quantity: 100, unit: "grams" },
      { name: "Broccoli", quantity: 100, unit: "grams" },
      { name: "Olive oil", quantity: 1, unit: "tbsp" }
    ],
    instructions: "1. Cook brown rice according to package. 2. Grill chicken breast with olive oil. 3. Steam broccoli. 4. Combine all in a bowl.",
    difficulty: "medium"
  },
  {
    name: "Spaghetti Marinara",
    description: "Classic Italian pasta with tomato sauce",
    prepTime: 20,
    servings: 2,
    costPerServing: 2.00,
    calories: 450,
    protein: 15,
    carbs: 75,
    fats: 8,
    category: "dinner",
    dietaryTags: ["vegetarian"],
    ingredients: [
      { name: "Spaghetti", quantity: 200, unit: "grams" },
      { name: "Tomato sauce", quantity: 300, unit: "ml" },
      { name: "Garlic", quantity: 3, unit: "piece" },
      { name: "Basil", quantity: 10, unit: "grams" },
      { name: "Olive oil", quantity: 2, unit: "tbsp" }
    ],
    instructions: "1. Boil pasta in salted water. 2. Sauté garlic in olive oil. 3. Add tomato sauce and simmer. 4. Toss with pasta and garnish with basil.",
    difficulty: "easy"
  },
  {
    name: "Apple with Peanut Butter",
    description: "Healthy and satisfying snack",
    prepTime: 2,
    servings: 1,
    costPerServing: 0.80,
    calories: 200,
    protein: 5,
    carbs: 25,
    fats: 9,
    category: "snack",
    dietaryTags: ["vegetarian"],
    ingredients: [
      { name: "Apple", quantity: 1, unit: "piece" },
      { name: "Peanut butter", quantity: 2, unit: "tbsp" }
    ],
    instructions: "1. Slice apple. 2. Spread peanut butter on slices. 3. Enjoy!",
    difficulty: "easy"
  }
];

export const seedRecipes = async () => {
  try {
    await Recipe.deleteMany({}); // Clear existing
    await Recipe.insertMany(sampleRecipes);
    console.log("✅ Recipes seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding recipes:", error);
  }
};