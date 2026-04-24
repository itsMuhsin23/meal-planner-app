import mongoose from "mongoose";

const recipeIngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['grams', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'oz', 'lb'],
    lowercase: true
  }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true,
    minlength: [3, 'Recipe name must be at least 3 characters'],
    maxlength: [100, 'Recipe name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        // Allow null or valid URL
        if (!v) return true;
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid image URL format'
    }
  },
  prepTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Prep time must be at least 1 minute'],
    max: [300, 'Prep time cannot exceed 300 minutes']
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Servings must be at least 1'],
    default: 1
  },
  costPerServing: {
    type: Number,
    required: [true, 'Cost per serving is required'],
    min: [0, 'Cost cannot be negative'],
    default: 0
  },
  calories: {
    type: Number,
    required: [true, 'Calories are required'],
    min: [0, 'Calories cannot be negative']
  },
  protein: {
    type: Number,
    required: [true, 'Protein is required'],
    min: [0, 'Protein cannot be negative'],
    default: 0
  },
  carbs: {
    type: Number,
    required: [true, 'Carbs are required'],
    min: [0, 'Carbs cannot be negative'],
    default: 0
  },
  fats: {
    type: Number,
    required: [true, 'Fats are required'],
    min: [0, 'Fats cannot be negative'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['breakfast', 'lunch', 'dinner', 'snack'],
      message: '{VALUE} is not a valid category'
    },
    lowercase: true
  },
  dietaryTags: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'high-protein'],
    lowercase: true
  }],
  ingredients: {
    type: [recipeIngredientSchema],
    required: [true, 'Ingredients are required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Recipe must have at least one ingredient'
    }
  },
  instructions: {
    type: String,
    required: [true, 'Instructions are required'],
    minlength: [10, 'Instructions must be at least 10 characters']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
    lowercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field: Calculate total cost
recipeSchema.virtual('totalCost').get(function() {
  return this.costPerServing * this.servings;
});

// Virtual field: Calories from macros (for validation)
recipeSchema.virtual('calculatedCalories').get(function() {
  return (this.protein * 4) + (this.carbs * 4) + (this.fats * 9);
});

// Index for faster queries
recipeSchema.index({ category: 1, isActive: 1 });
recipeSchema.index({ dietaryTags: 1 });
recipeSchema.index({ name: 'text', description: 'text' }); // Text search

// Pre-save validation: Check if calorie calculation is reasonable
recipeSchema.pre('save', function() {
  const calculated = (this.protein * 4) + (this.carbs * 4) + (this.fats * 9);
  const difference = Math.abs(this.calories - calculated);
  
  // Allow 10% difference
  if (difference > calculated * 0.1) {
    console.warn(`Warning: Calorie mismatch for ${this.name}. Stated: ${this.calories}, Calculated: ${calculated}`);
  }
  
  
});

// Static method: Find recipes by dietary preference
recipeSchema.statics.findByDietaryPreference = function(preference) {
  return this.find({ 
    dietaryTags: preference,
    isActive: true 
  });
};

// Static method: Find recipes within budget and calorie range
recipeSchema.statics.findByBudgetAndCalories = function(maxCost, minCal, maxCal) {
  return this.find({
    costPerServing: { $lte: maxCost },
    calories: { $gte: minCal, $lte: maxCal },
    isActive: true
  });
};

// Instance method: Scale recipe servings
recipeSchema.methods.scaleServings = function(newServings) {
  const scaleFactor = newServings / this.servings;
  
  return {
    ...this.toObject(),
    servings: newServings,
    ingredients: this.ingredients.map(ing => ({
      ...ing,
      quantity: ing.quantity * scaleFactor
    }))
  };
};

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;