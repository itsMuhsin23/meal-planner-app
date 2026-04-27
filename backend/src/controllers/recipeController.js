import Recipe from "../models/recipe.js";

// CREATE recipe
export const createRecipe = async (req, res) => {
  try {
    console.log("BODY:", req.body); // 👈 ADD THIS

    const recipe = new Recipe(req.body);
    await recipe.save();

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: recipe
    });
  } catch (error) {
    console.error("CREATE ERROR:", error); // 👈 ADD THIS

    res.status(500).json({
      success: false,
      message: "Failed to create recipe",
      error: error.message
    });
  }
};

// GET all recipes with filtering and pagination
export const getRecipes = async (req, res) => {
  try {
    const {
      category,
      dietaryTags,
      minCalories,
      maxCalories,
      maxCost,
      page = 1,
      limit = 20,
      sort = 'name',
      search
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) {
      filter.category = category.toLowerCase();
    }
    
    if (dietaryTags) {
      filter.dietaryTags = { $in: Array.isArray(dietaryTags) ? dietaryTags : [dietaryTags] };
    }
    
    if (minCalories || maxCalories) {
      filter.calories = {};
      if (minCalories) filter.calories.$gte = Number(minCalories);
      if (maxCalories) filter.calories.$lte = Number(maxCalories);
    }
    
    if (maxCost) {
      filter.costPerServing = { $lte: Number(maxCost) };
    }
    
    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const recipes = await Recipe.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Recipe.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: recipes,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalRecipes: total,
        recipesPerPage: limitNum
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recipes",
      error: error.message
    });
  }
};

// GET single recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recipe",
      error: error.message
    });
  }
};

// UPDATE recipe
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,           // Return updated document
        runValidators: true  // Run schema validations
      }
    );
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      data: recipe
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error); // 👈 ADD THIS

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to update recipe",
      error: error.message
    });
  }
};

// DELETE recipe (soft delete)
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
      data: recipe
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete recipe",
      error: error.message
    });
  }
};

// GET recipes by category
export const getRecipesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const recipes = await Recipe.find({ 
      category: category.toLowerCase(),
      isActive: true 
    });
    
    res.status(200).json({
      success: true,
      data: recipes,
      count: recipes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recipes by category",
      error: error.message
    });
  }
};

// GET recipes by dietary preference
export const getRecipesByDiet = async (req, res) => {
  try {
    const { diet } = req.params;
    
    const recipes = await Recipe.findByDietaryPreference(diet.toLowerCase());
    
    res.status(200).json({
      success: true,
      data: recipes,
      count: recipes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recipes by dietary preference",
      error: error.message
    });
  }
};

// GET recipes for meal plan generation
export const getRecipesForMealPlan = async (req, res) => {
  try {
    const { 
      dailyBudget,
      dailyCalories,
      dietaryPreference 
    } = req.query;

    const filter = { isActive: true };
    
    // Apply dietary filter
    if (dietaryPreference && dietaryPreference !== 'none') {
      filter.dietaryTags = dietaryPreference.toLowerCase();
    }

    // Calculate budget per meal type
    const budgetDistribution = {
      breakfast: Number(dailyBudget) * 0.20,
      lunch: Number(dailyBudget) * 0.35,
      dinner: Number(dailyBudget) * 0.40,
      snack: Number(dailyBudget) * 0.05
    };

    // Calculate calories per meal type
    const calorieDistribution = {
      breakfast: Number(dailyCalories) * 0.25,
      lunch: Number(dailyCalories) * 0.35,
      dinner: Number(dailyCalories) * 0.35,
      snack: Number(dailyCalories) * 0.05
    };

    // Get recipes for each category
    const mealPlan = {};
    
    for (const [category, budget] of Object.entries(budgetDistribution)) {
      const targetCalories = calorieDistribution[category];
      
      const recipes = await Recipe.find({
        ...filter,
        category: category,
        costPerServing: { $lte: budget },
        calories: { 
          $gte: targetCalories * 0.8,  // 20% tolerance
          $lte: targetCalories * 1.2 
        }
      }).limit(10);
      
      mealPlan[category] = recipes;
    }

    res.status(200).json({
      success: true,
      data: mealPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recipes for meal plan",
      error: error.message
    });
  }
};

// BULK CREATE recipes
export const bulkCreateRecipes = async (req, res) => {
  try {
    const recipes = req.body.recipes;
    
    if (!Array.isArray(recipes)) {
      return res.status(400).json({
        success: false,
        message: "Request body must contain an array of recipes"
      });
    }

    const createdRecipes = await Recipe.insertMany(recipes, { 
      ordered: false // Continue on error
    });
    
    res.status(201).json({
      success: true,
      message: `${createdRecipes.length} recipes created successfully`,
      data: createdRecipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to bulk create recipes",
      error: error.message
    });
  }
};

// GET recipe statistics
export const getRecipeStats = async (req, res) => {
  try {
    const stats = await Recipe.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgCalories: { $avg: '$calories' },
          avgCost: { $avg: '$costPerServing' },
          avgProtein: { $avg: '$protein' },
          avgCarbs: { $avg: '$carbs' },
          avgFats: { $avg: '$fats' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalRecipes = await Recipe.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        totalRecipes,
        byCategory: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recipe statistics",
      error: error.message
    });
  }
};