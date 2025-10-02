# Mama's Kitchen - Simple API Guide

## ✅ What Changed (Simplified for Junior Devs!)

### 1. CSS Animations - Kept Simple

**Only TWO animations now:**

- ✅ Image zoom on recipe cards (looks professional!)
- ✅ Modal fade in (subtle and nice)
- ❌ Removed all the complex animations

### 2. APIs - Much Simpler

**Before:** Complex system with Spoonacular + TheMealDB + adapter
**Now:** Simple and clean!

- ✅ **Spoonacular** for recipes (API #1)
- ✅ **Edamam** for nutrition (API #2)
- ❌ Removed complex adapter (too advanced!)

---

## 🎯 Two Simple APIs

### API #1: Spoonacular (Recipes)

**File:** `recipeService.js`

```javascript
import { getAllRecipes, searchRecipes } from "./recipeService.js";

// Get recipes
const recipes = await getAllRecipes();

// Search recipes
const results = await searchRecipes("pasta");
```

**What it does:**

- Searches for recipes
- Gets recipe details
- Returns recipe data

**API Key Needed:**

- Free at: [spoonacular.com/food-api](https://spoonacular.com/food-api)
- Free tier: 150 calls/day

---

### API #2: Edamam (Nutrition)

**File:** `nutritionService.js`

```javascript
import { analyzeNutrition, getNutritionForRecipe } from "./nutritionService.js";

// Get nutrition for ingredients
const nutrition = await analyzeNutrition(["1 cup rice", "2 chicken breasts"]);

// Or get nutrition for a recipe
const recipe = await getRecipeById(123);
const nutrition = await getNutritionForRecipe(recipe);
```

**What it does:**

- Analyzes ingredients
- Returns calories, protein, carbs, etc.
- Gives daily percentage values

**API Keys Needed:**

- Free at: [developer.edamam.com](https://developer.edamam.com/)
- Choose "Nutrition Analysis API"
- Free tier: 200 calls/month
- You get TWO keys: App ID + App Key

---

## 🔧 Setup Instructions

### Development Mode (Current)

```javascript
// recipeService.js
const USE_MOCK_DATA = true; // ← You're here!
```

**What this means:**

- ✅ Uses mock recipes from `mockRecipes.js`
- ✅ Zero API calls (saves your limit!)
- ✅ Can reload unlimited times
- ✅ Perfect for building features

---

### Production Mode (When Ready)

**Step 1: Get Spoonacular Key**

1. Go to https://spoonacular.com/food-api
2. Sign up (free)
3. Copy your API key

**Step 2: Get Edamam Keys**

1. Go to https://developer.edamam.com/
2. Sign up (free)
3. Select "Nutrition Analysis API"
4. Copy your App ID and App Key

**Step 3: Add Keys to Code**

In `recipeService.js`:

```javascript
const SPOONACULAR_API_KEY = "paste_your_key_here";
```

In `nutritionService.js`:

```javascript
const EDAMAM_APP_ID = "paste_your_app_id";
const EDAMAM_APP_KEY = "paste_your_app_key";
```

**Step 4: Enable Live APIs**

In `recipeService.js`:

```javascript
const USE_MOCK_DATA = false; // ← Change to false
```

---

## 📝 Code Examples

### Example 1: Display Recipes

```javascript
import { getAllRecipes } from "./recipeService.js";

async function showRecipes() {
  const recipes = await getAllRecipes();

  recipes.forEach((recipe) => {
    console.log(recipe.title);
    console.log(`${recipe.readyInMinutes} minutes`);
    console.log(`${recipe.servings} servings`);
  });
}
```

### Example 2: Search Recipes

```javascript
import { searchRecipes } from "./recipeService.js";

async function searchForPasta() {
  const results = await searchRecipes("pasta");
  console.log(`Found ${results.length} pasta recipes`);
}
```

### Example 3: Get Nutrition

```javascript
import { analyzeNutrition } from "./nutritionService.js";

async function checkNutrition() {
  const nutrition = await analyzeNutrition([
    "1 cup rice",
    "2 eggs",
    "1 tablespoon butter",
  ]);

  console.log(`Total calories: ${nutrition.calories}`);
  console.log(`Protein: ${nutrition.protein.amount}g`);
  console.log(`Carbs: ${nutrition.carbs.amount}g`);
  console.log(`Fat: ${nutrition.fat.amount}g`);
}
```

### Example 4: Recipe + Nutrition Together

```javascript
import { getRecipeById } from "./recipeService.js";
import { getNutritionForRecipe } from "./nutritionService.js";

async function showRecipeWithNutrition(recipeId) {
  // Get recipe from Spoonacular
  const recipe = await getRecipeById(recipeId);
  console.log(`Recipe: ${recipe.title}`);

  // Get nutrition from Edamam
  const nutrition = await getNutritionForRecipe(recipe);
  console.log(`Calories: ${nutrition.calories}`);
  console.log(`Protein: ${nutrition.protein.amount}g`);
}
```

---

## 🎨 CSS Animations

**What's Included:**

1. **Image Zoom** (automatic on hover)

```css
.recipe-card:hover .recipe-image {
  transform: scale(1.08);
}
```

2. **Modal Fade** (automatic when modal opens)

```css
.modal-overlay {
  animation: fadeIn 0.3s ease-out;
}
```

That's it! Simple and professional. ✨

---

## ✅ Project Requirements Check

| Requirement        | Status | How                     |
| ------------------ | ------ | ----------------------- |
| 2 External APIs    | ✅     | Spoonacular + Edamam    |
| Not OpenWeatherMap | ✅     | Using recipe APIs       |
| CSS Animation      | ✅     | Image zoom + modal fade |
| Vanilla JS         | ✅     | No frameworks           |
| ES Modules         | ✅     | import/export           |
| Clean Code         | ✅     | Commented & organized   |

---

## 🐛 Common Issues

### "Using mock data" in console?

✅ **Normal!** That means you're in development mode.
To use real APIs, set `USE_MOCK_DATA = false`

### Nutrition API returns null?

❌ Check you added BOTH App ID and App Key
❌ Check ingredients array is formatted correctly

### Recipe API returns empty array?

❌ Check your API key is correct
❌ Check you haven't exceeded 150 calls/day

---

## 🎓 Why This Approach?

**Simple = Better for Learning!**

✅ **One API per file**

- `recipeService.js` = recipes
- `nutritionService.js` = nutrition
- Easy to understand!

✅ **No complex adapters**

- Spoonacular data is already good
- Edamam data is separate
- No need to normalize!

✅ **Clear separation**

- Recipes from Spoonacular
- Nutrition from Edamam
- They don't need to be combined!

---

## 📚 API Documentation Links

- **Spoonacular Docs**: https://spoonacular.com/food-api/docs
- **Edamam Docs**: https://developer.edamam.com/edamam-docs-nutrition-api

---

## 🎉 You're Ready!

Your setup is now:

- ✅ Simple and beginner-friendly
- ✅ Two clear APIs
- ✅ Professional animations (not overdone!)
- ✅ Mock data for development
- ✅ Easy to test with real APIs

**Build great features and have fun coding!** 👨‍🍳👩‍🍳
