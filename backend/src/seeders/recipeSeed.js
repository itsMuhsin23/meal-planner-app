import Recipe from "../models/recipe.js";

// 5 recipes per category = 20 total (enough for 7-day variety)
const sampleRecipes = [

  // ──────────── BREAKFAST (target ~300-500 cal, ~$0.50-2.00) ────────────────
  {
    name: "Banana Oatmeal",
    description: "Quick and filling oats with banana",
    prepTime: 5, servings: 1, costPerServing: 0.50,
    calories: 300, protein: 8, carbs: 54, fats: 5,
    category: "breakfast", difficulty: "easy",
    dietaryTags: ["vegetarian", "vegan"],
    ingredients: [
      { name: "Oats",        quantity: 50,  unit: "grams" },
      { name: "Banana",      quantity: 1,   unit: "piece" },
      { name: "Almond milk", quantity: 200, unit: "ml"    }
    ],
    instructions: "1. Boil milk. 2. Add oats, cook 3 min. 3. Top with sliced banana."
  },
  {
    name: "Scrambled Eggs on Toast",
    description: "Classic high-protein breakfast",
    prepTime: 8, servings: 1, costPerServing: 1.20,
    calories: 380, protein: 22, carbs: 30, fats: 18,
    category: "breakfast", difficulty: "easy",
    dietaryTags: ["vegetarian"],
    ingredients: [
      { name: "Eggs",   quantity: 3, unit: "piece" },
      { name: "Bread",  quantity: 2, unit: "piece" },
      { name: "Butter", quantity: 1, unit: "tbsp"  }
    ],
    instructions: "1. Whisk eggs. 2. Cook on low heat stirring constantly. 3. Toast bread. 4. Serve eggs on toast."
  },
  {
    name: "Greek Yogurt Parfait",
    description: "Creamy yogurt with berries and granola",
    prepTime: 3, servings: 1, costPerServing: 1.80,
    calories: 340, protein: 18, carbs: 48, fats: 6,
    category: "breakfast", difficulty: "easy",
    dietaryTags: ["vegetarian", "gluten-free"],
    ingredients: [
      { name: "Greek yogurt", quantity: 200, unit: "grams" },
      { name: "Granola",      quantity: 40,  unit: "grams" },
      { name: "Mixed berries",quantity: 80,  unit: "grams" }
    ],
    instructions: "1. Layer yogurt in a bowl. 2. Add granola. 3. Top with berries."
  },
  {
    name: "Peanut Butter Toast",
    description: "Simple high-energy breakfast",
    prepTime: 3, servings: 1, costPerServing: 0.70,
    calories: 420, protein: 14, carbs: 45, fats: 20,
    category: "breakfast", difficulty: "easy",
    dietaryTags: ["vegetarian", "vegan"],
    ingredients: [
      { name: "Whole wheat bread", quantity: 2,  unit: "piece" },
      { name: "Peanut butter",     quantity: 30, unit: "grams" },
      { name: "Banana",            quantity: 1,  unit: "piece" }
    ],
    instructions: "1. Toast bread. 2. Spread peanut butter. 3. Slice banana on top."
  },
  {
    name: "Veggie Omelette",
    description: "Protein-rich omelette loaded with vegetables",
    prepTime: 10, servings: 1, costPerServing: 1.50,
    calories: 350, protein: 24, carbs: 10, fats: 22,
    category: "breakfast", difficulty: "medium",
    dietaryTags: ["vegetarian", "gluten-free", "keto"],
    ingredients: [
      { name: "Eggs",       quantity: 3,  unit: "piece" },
      { name: "Spinach",    quantity: 50, unit: "grams" },
      { name: "Tomato",     quantity: 1,  unit: "piece" },
      { name: "Olive oil",  quantity: 1,  unit: "tbsp"  }
    ],
    instructions: "1. Whisk eggs with salt and pepper. 2. Sauté veggies. 3. Pour egg mixture, fold when set."
  },

  // ──────────── LUNCH (target ~500-750 cal, ~$2.00-4.00) ───────────────────
  {
    name: "Chicken Rice Bowl",
    description: "Protein-packed grilled chicken with brown rice",
    prepTime: 25, servings: 1, costPerServing: 3.50,
    calories: 550, protein: 45, carbs: 60, fats: 12,
    category: "lunch", difficulty: "medium",
    dietaryTags: ["high-protein", "gluten-free"],
    ingredients: [
      { name: "Chicken breast", quantity: 150, unit: "grams" },
      { name: "Brown rice",     quantity: 100, unit: "grams" },
      { name: "Broccoli",       quantity: 100, unit: "grams" },
      { name: "Olive oil",      quantity: 1,   unit: "tbsp"  }
    ],
    instructions: "1. Cook rice. 2. Season and grill chicken. 3. Steam broccoli. 4. Combine in a bowl."
  },
  {
    name: "Tuna Salad Wrap",
    description: "Light and filling tuna salad in a tortilla",
    prepTime: 10, servings: 1, costPerServing: 2.50,
    calories: 480, protein: 35, carbs: 45, fats: 14,
    category: "lunch", difficulty: "easy",
    dietaryTags: ["high-protein", "dairy-free"],
    ingredients: [
      { name: "Canned tuna",   quantity: 120, unit: "grams" },
      { name: "Tortilla wrap", quantity: 1,   unit: "piece" },
      { name: "Lettuce",       quantity: 50,  unit: "grams" },
      { name: "Mayonnaise",    quantity: 1,   unit: "tbsp"  }
    ],
    instructions: "1. Mix tuna with mayo. 2. Place on wrap with lettuce. 3. Roll tightly."
  },
  {
    name: "Lentil Soup",
    description: "Hearty and nutritious vegetarian soup",
    prepTime: 30, servings: 2, costPerServing: 1.80,
    calories: 420, protein: 22, carbs: 65, fats: 5,
    category: "lunch", difficulty: "medium",
    dietaryTags: ["vegetarian", "vegan", "gluten-free"],
    ingredients: [
      { name: "Red lentils", quantity: 150, unit: "grams" },
      { name: "Carrot",      quantity: 2,   unit: "piece" },
      { name: "Onion",       quantity: 1,   unit: "piece" },
      { name: "Cumin",       quantity: 1,   unit: "tsp"   }
    ],
    instructions: "1. Sauté onion and carrot. 2. Add lentils and water. 3. Simmer 25 min. 4. Season with cumin."
  },
  {
    name: "Egg Fried Rice",
    description: "Budget-friendly fried rice with egg",
    prepTime: 15, servings: 1, costPerServing: 1.20,
    calories: 520, protein: 18, carbs: 78, fats: 14,
    category: "lunch", difficulty: "easy",
    dietaryTags: ["vegetarian", "dairy-free"],
    ingredients: [
      { name: "Cooked rice",     quantity: 200, unit: "grams" },
      { name: "Eggs",            quantity: 2,   unit: "piece" },
      { name: "Mixed vegetables",quantity: 100, unit: "grams" },
      { name: "Soy sauce",       quantity: 2,   unit: "tbsp"  }
    ],
    instructions: "1. Heat oil. 2. Scramble eggs. 3. Add rice and vegetables. 4. Season with soy sauce."
  },
  {
    name: "Black Bean Burrito",
    description: "Filling plant-based burrito",
    prepTime: 12, servings: 1, costPerServing: 2.00,
    calories: 600, protein: 25, carbs: 88, fats: 12,
    category: "lunch", difficulty: "easy",
    dietaryTags: ["vegetarian", "vegan"],
    ingredients: [
      { name: "Tortilla",    quantity: 1,   unit: "piece" },
      { name: "Black beans", quantity: 150, unit: "grams" },
      { name: "Rice",        quantity: 80,  unit: "grams" },
      { name: "Salsa",       quantity: 50,  unit: "grams" }
    ],
    instructions: "1. Warm beans and rice. 2. Place in tortilla with salsa. 3. Wrap and serve."
  },

  // ──────────── DINNER (target ~500-750 cal, ~$2.50-5.00) ──────────────────
  {
    name: "Spaghetti Marinara",
    description: "Classic Italian pasta with tomato sauce",
    prepTime: 20, servings: 2, costPerServing: 2.00,
    calories: 450, protein: 15, carbs: 75, fats: 8,
    category: "dinner", difficulty: "easy",
    dietaryTags: ["vegetarian"],
    ingredients: [
      { name: "Spaghetti",    quantity: 200, unit: "grams" },
      { name: "Tomato sauce", quantity: 300, unit: "ml"    },
      { name: "Garlic",       quantity: 3,   unit: "piece" },
      { name: "Olive oil",    quantity: 2,   unit: "tbsp"  }
    ],
    instructions: "1. Boil pasta. 2. Sauté garlic in oil. 3. Add sauce and simmer. 4. Toss with pasta."
  },
  {
    name: "Baked Chicken Thighs",
    description: "Juicy oven-baked chicken with roasted vegetables",
    prepTime: 40, servings: 2, costPerServing: 3.80,
    calories: 580, protein: 48, carbs: 20, fats: 32,
    category: "dinner", difficulty: "easy",
    dietaryTags: ["high-protein", "gluten-free", "keto"],
    ingredients: [
      { name: "Chicken thighs", quantity: 300, unit: "grams" },
      { name: "Sweet potato",   quantity: 200, unit: "grams" },
      { name: "Olive oil",      quantity: 2,   unit: "tbsp"  },
      { name: "Paprika",        quantity: 1,   unit: "tsp"   }
    ],
    instructions: "1. Season chicken. 2. Roast at 200°C for 35 min. 3. Roast sweet potato alongside. 4. Serve together."
  },
  {
    name: "Vegetable Curry",
    description: "Fragrant and filling vegetable curry",
    prepTime: 30, servings: 2, costPerServing: 2.20,
    calories: 480, protein: 14, carbs: 68, fats: 16,
    category: "dinner", difficulty: "medium",
    dietaryTags: ["vegetarian", "vegan", "gluten-free"],
    ingredients: [
      { name: "Chickpeas",      quantity: 200, unit: "grams" },
      { name: "Coconut milk",   quantity: 200, unit: "ml"    },
      { name: "Spinach",        quantity: 100, unit: "grams" },
      { name: "Curry powder",   quantity: 2,   unit: "tbsp"  }
    ],
    instructions: "1. Fry onion and curry powder. 2. Add chickpeas and coconut milk. 3. Simmer 15 min. 4. Stir in spinach."
  },
  {
    name: "Beef Stir-fry",
    description: "Quick high-protein beef with vegetables",
    prepTime: 20, servings: 2, costPerServing: 4.50,
    calories: 520, protein: 40, carbs: 35, fats: 22,
    category: "dinner", difficulty: "medium",
    dietaryTags: ["high-protein", "dairy-free"],
    ingredients: [
      { name: "Beef strips",     quantity: 200, unit: "grams" },
      { name: "Bell pepper",     quantity: 2,   unit: "piece" },
      { name: "Soy sauce",       quantity: 3,   unit: "tbsp"  },
      { name: "Noodles",         quantity: 150, unit: "grams" }
    ],
    instructions: "1. Cook noodles. 2. Stir-fry beef on high heat. 3. Add peppers and soy sauce. 4. Toss with noodles."
  },
  {
    name: "Salmon with Quinoa",
    description: "Omega-3 rich salmon with protein quinoa",
    prepTime: 25, servings: 1, costPerServing: 5.00,
    calories: 620, protein: 50, carbs: 45, fats: 24,
    category: "dinner", difficulty: "medium",
    dietaryTags: ["gluten-free", "dairy-free", "high-protein"],
    ingredients: [
      { name: "Salmon fillet", quantity: 200, unit: "grams" },
      { name: "Quinoa",        quantity: 100, unit: "grams" },
      { name: "Lemon",         quantity: 1,   unit: "piece" },
      { name: "Olive oil",     quantity: 1,   unit: "tbsp"  }
    ],
    instructions: "1. Cook quinoa. 2. Season salmon with lemon and oil. 3. Pan-fry 4 min each side. 4. Serve together."
  },

  // ──────────── SNACK (target ~100-200 cal, ~$0.30-1.00) ───────────────────
  {
    name: "Apple with Peanut Butter",
    description: "Healthy and satisfying snack",
    prepTime: 2, servings: 1, costPerServing: 0.80,
    calories: 200, protein: 5, carbs: 25, fats: 9,
    category: "snack", difficulty: "easy",
    dietaryTags: ["vegetarian", "vegan"],
    ingredients: [
      { name: "Apple",         quantity: 1, unit: "piece" },
      { name: "Peanut butter", quantity: 2, unit: "tbsp"  }
    ],
    instructions: "1. Slice apple. 2. Serve with peanut butter for dipping."
  },
  {
    name: "Mixed Nuts",
    description: "Energy-dense healthy handful of nuts",
    prepTime: 1, servings: 1, costPerServing: 0.90,
    calories: 180, protein: 5, carbs: 8, fats: 16,
    category: "snack", difficulty: "easy",
    dietaryTags: ["vegetarian", "vegan", "gluten-free", "keto"],
    ingredients: [
      { name: "Mixed nuts", quantity: 30, unit: "grams" }
    ],
    instructions: "1. Portion 30g of mixed nuts. 2. Enjoy."
  },
  {
    name: "Hummus and Carrots",
    description: "Creamy hummus with crunchy carrots",
    prepTime: 2, servings: 1, costPerServing: 0.70,
    calories: 150, protein: 5, carbs: 18, fats: 6,
    category: "snack", difficulty: "easy",
    dietaryTags: ["vegetarian", "vegan", "gluten-free"],
    ingredients: [
      { name: "Hummus",  quantity: 60, unit: "grams" },
      { name: "Carrots", quantity: 3,  unit: "piece" }
    ],
    instructions: "1. Peel and slice carrots. 2. Serve with hummus."
  },
  {
    name: "Banana",
    description: "Quick natural energy boost",
    prepTime: 1, servings: 1, costPerServing: 0.30,
    calories: 105, protein: 1, carbs: 27, fats: 0,
    category: "snack", difficulty: "easy",
    dietaryTags: ["vegetarian", "vegan", "gluten-free"],
    ingredients: [
      { name: "Banana", quantity: 1, unit: "piece" }
    ],
    instructions: "1. Peel banana. 2. Eat."
  },
  {
    name: "Cottage Cheese with Berries",
    description: "High-protein low-fat snack",
    prepTime: 2, servings: 1, costPerServing: 1.00,
    calories: 160, protein: 14, carbs: 18, fats: 2,
    category: "snack", difficulty: "easy",
    dietaryTags: ["vegetarian", "gluten-free", "high-protein"],
    ingredients: [
      { name: "Cottage cheese", quantity: 150, unit: "grams" },
      { name: "Mixed berries",  quantity: 80,  unit: "grams" }
    ],
    instructions: "1. Spoon cottage cheese into bowl. 2. Top with berries."
  }
];

export const seedRecipes = async () => {
  try {
    await Recipe.deleteMany({});
    await Recipe.insertMany(sampleRecipes);
    console.log(`✅ Seeded ${sampleRecipes.length} recipes successfully`);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    throw err;
  }
};
