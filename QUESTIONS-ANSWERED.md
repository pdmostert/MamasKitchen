# Your Questions Answered - Mama's Kitchen API Strategy

## ❓ Question 1: Mock Recipes Structure

### The Problem

You noticed the mock recipes had a nested array structure:

```javascript
export const mockRecipes = [
  {
    recipes: [
      // actual recipes here
    ],
  },
];
```

### The Solution ✅

**We kept this structure** because it matches Spoonacular's API response format exactly. However, we built smart handlers in `recipeService.js` that extract the recipes properly:

```javascript
function getMockRecipes() {
  // Handles nested structure: [{recipes: [...]}]
  if (Array.isArray(mockRecipes) && mockRecipes.length > 0) {
    if (mockRecipes[0].recipes && Array.isArray(mockRecipes[0].recipes)) {
      return mockRecipes[0].recipes; // ← Extracts the inner array
    }
  }
  // Multiple fallbacks for safety
  return [];
}
```

**Why this works:**

- ✅ Mock data matches real API format
- ✅ Easy to switch from mock to real data
- ✅ No structure changes needed when going live
- ✅ Automatic extraction in `getAllRecipes()`

---

## ❓ Question 2: Different API Data Structures

### The Problem

Spoonacular and TheMealDB return completely different structures:

**Spoonacular:**

```json
{
  "id": 632250,
  "title": "Tomato Soup",
  "readyInMinutes": 45,
  "extendedIngredients": [...]
}
```

**TheMealDB:**

```json
{
  "idMeal": "52874",
  "strMeal": "Tomato Soup",
  "strIngredient1": "Tomatoes",
  "strMeasure1": "2 cups",
  "strIngredient2": "Onion"
  // ... up to ingredient20
}
```

### The Solution ✅

**Data Adapter Pattern** - We created `recipeAdapter.js` that normalizes both:

```javascript
// Spoonacular normalizer
export function normalizeSpoonacularRecipe(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    // ... maps Spoonacular fields
    source: "spoonacular",
  };
}

// TheMealDB normalizer
export function normalizeMealDBRecipe(recipe) {
  // Extracts ingredients from flat structure
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient) {
      ingredients.push({
        name: ingredient,
        original: `${measure} ${ingredient}`,
      });
    }
  }

  return {
    id: `mealdb-${recipe.idMeal}`, // Prefix to avoid conflicts
    title: recipe.strMeal,
    image: recipe.strMealThumb,
    extendedIngredients: ingredients, // ← Normalized format
    // ... maps TheMealDB fields to unified format
    source: "mealdb",
  };
}
```

**Unified Format:**

```javascript
{
  id: string|number,
  title: string,
  image: string,
  readyInMinutes: number,
  servings: number,
  vegetarian: boolean,
  vegan: boolean,
  glutenFree: boolean,
  dairyFree: boolean,
  healthScore: number,
  extendedIngredients: Array,
  summary: string,
  cuisines: Array,
  dishTypes: Array,
  diets: Array,
  source: 'spoonacular'|'mealdb'|'mock'
}
```

**Result:**

- ✅ Your UI code receives the same format from both APIs
- ✅ No need to check which API the data came from
- ✅ Easy to display recipes consistently
- ✅ Can mix data from both APIs seamlessly

---

## ❓ Question 3: How APIs Work Together

### Architecture Flow

```
User searches for "chicken"
        │
        ▼
┌──────────────────────┐
│  searchRecipes()     │
│  (recipeService.js)  │
└───────┬──────────────┘
        │
        ├─► if (USE_MOCK_DATA)
        │     └─► Get from mockRecipes.js
        │          └─► Normalize as Spoonacular
        │               └─► Return unified format
        │
        └─► if (!USE_MOCK_DATA)
              ├─► Search Spoonacular API
              │    └─► Get Spoonacular recipes
              │         └─► normalizeSpoonacularRecipe()
              │
              └─► Search TheMealDB API
                   └─► Get TheMealDB recipes
                        └─► normalizeMealDBRecipe()
                             │
                             ▼
                    Combine both results
                    All in unified format!
                             │
                             ▼
                    Return to UI
```

### Example: Search Implementation

```javascript
export async function searchRecipes(query, options = {}) {
  if (USE_MOCK_DATA) {
    // Development: use mock data
    const allRecipes = getMockRecipes();
    const normalized = normalizeRecipes(allRecipes, "spoonacular");
    return normalized.filter((recipe) =>
      recipe.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Production: search both APIs
  const [spoonacularResults, mealDBResults] = await Promise.all([
    searchSpoonacularRecipes(query, options), // ← Calls Spoonacular
    searchMealDBRecipes(query), // ← Calls TheMealDB
  ]);

  // Both are already normalized, just combine them!
  return [...spoonacularResults, ...mealDBResults];
}
```

**Key Point:** Both API results are normalized BEFORE being returned, so your UI never sees the original format differences!

---

## 📊 Practical Example

### Scenario: Display Recipe Cards

Your code:

```javascript
import { getAllRecipes } from "./recipeService.js";

async function displayRecipes() {
  const recipes = await getAllRecipes(); // ← Simple call

  recipes.forEach((recipe) => {
    // ALL recipes have the same structure, regardless of source!
    const card = `
      <div class="recipe-card">
        <img src="${recipe.image}">
        <h3>${recipe.title}</h3>
        <p>⏱️ ${recipe.readyInMinutes} min</p>
        <p>🍽️ ${recipe.servings} servings</p>
        ${recipe.vegetarian ? "🌱 Vegetarian" : ""}
        ${recipe.vegan ? "🥗 Vegan" : ""}
      </div>
    `;
    grid.innerHTML += card;
  });
}
```

**What happens behind the scenes:**

1. **Development Mode** (`USE_MOCK_DATA = true`):
   - Gets data from `mockRecipes.js`
   - Normalizes to unified format
   - Returns to your code

2. **Production Mode** (`USE_MOCK_DATA = false`):
   - Fetches from Spoonacular (5 recipes)
   - Fetches from TheMealDB (5 recipes)
   - Normalizes BOTH to unified format
   - Combines into one array
   - Returns to your code

**Your display code doesn't change at all!** 🎉

---

## 🎯 Key Benefits

### 1. Development Efficiency

```javascript
// While building features:
USE_MOCK_DATA = true

// Benefits:
✅ No API calls used
✅ Fast page reloads
✅ Consistent test data
✅ Build UI features quickly
```

### 2. API Flexibility

```javascript
// When ready for real data:
USE_MOCK_DATA = false

// Benefits:
✅ Get 10+ recipes per search (both APIs)
✅ More recipe variety
✅ Fresh, real data
✅ One API fails? The other still works!
```

### 3. Code Simplicity

```javascript
// Your code stays simple:
const recipes = await getAllRecipes();

// Works with:
✅ Mock data
✅ Spoonacular only
✅ TheMealDB only
✅ Both APIs combined
✅ Future APIs (just add normalizer!)
```

---

## 🔍 Handling Missing Data

Different APIs have different data:

| Field             | Spoonacular | TheMealDB | Handled By         |
| ----------------- | ----------- | --------- | ------------------ |
| `readyInMinutes`  | ✅ Yes      | ❌ No     | Default to 0       |
| `pricePerServing` | ✅ Yes      | ❌ No     | Default to 0       |
| `healthScore`     | ✅ Yes      | ❌ No     | Default to 50      |
| `nutrition`       | ✅ Yes      | ❌ No     | Not included       |
| `category`        | ❌ No       | ✅ Yes    | Map to `dishTypes` |
| `area`            | ❌ No       | ✅ Yes    | Map to `cuisines`  |

**The normalizer handles all of this:**

```javascript
// TheMealDB normalizer provides defaults
export function normalizeMealDBRecipe(recipe) {
  return {
    // Fields TheMealDB has
    title: recipe.strMeal,
    image: recipe.strMealThumb,

    // Fields TheMealDB doesn't have (use defaults)
    readyInMinutes: 0, // Not provided
    pricePerServing: 0, // Not provided
    healthScore: 50, // Default middle score
    servings: 4, // Reasonable default

    // Map TheMealDB fields to our format
    cuisines: recipe.strArea ? [recipe.strArea] : [],
    dishTypes: recipe.strCategory ? [recipe.strCategory] : [],

    source: "mealdb", // Mark the source
  };
}
```

---

## 💡 Advanced Features

### Feature 1: Filter by Dietary Preferences

```javascript
// Works with data from ANY source!
import { matchesFilters } from "./recipeAdapter.js";

const recipes = await getAllRecipes();

const vegetarianRecipes = recipes.filter((recipe) =>
  matchesFilters(recipe, { vegetarian: true })
);
```

### Feature 2: Sort Recipes

```javascript
import { sortRecipes } from "./recipeAdapter.js";

const recipes = await getAllRecipes();

// Sort by popularity (Spoonacular has likes, TheMealDB defaults to 0)
const popular = sortRecipes(recipes, "likes", "desc");

// Sort by cooking time
const quickMeals = sortRecipes(recipes, "time", "asc");
```

### Feature 3: Detect Source

```javascript
const recipe = await getRecipeById(someId);

if (recipe.source === "spoonacular") {
  // Show nutrition info (Spoonacular has it)
  displayNutrition(recipe);
} else if (recipe.source === "mealdb") {
  // Show category/area (TheMealDB specialties)
  displayCategory(recipe.dishTypes[0]);
}
```

---

## ✅ Summary: Your Questions Answered

### ✅ Mock Recipe Structure

- Kept nested format to match Spoonacular API
- Automatic extraction in `getAllRecipes()`
- Works seamlessly with real API

### ✅ Different API Structures

- **recipeAdapter.js** normalizes both APIs
- Unified format for all recipes
- UI code doesn't care about the source

### ✅ Using Both APIs Together

- Both are called in parallel
- Both are normalized to same format
- Combined into single array
- Your code sees no difference!

---

## 🚀 Ready to Use!

You can now:

1. ✅ Build with mock data (`USE_MOCK_DATA = true`)
2. ✅ Switch to real APIs when ready (`USE_MOCK_DATA = false`)
3. ✅ Display recipes from both APIs consistently
4. ✅ Filter and sort regardless of source
5. ✅ Add more APIs easily (just create normalizer!)

**The complexity is hidden - your code stays simple!** 🎉
