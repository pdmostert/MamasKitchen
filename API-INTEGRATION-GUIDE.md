# API Integration Guide - Mama's Kitchen

## 📚 Overview

This guide explains how Mama's Kitchen handles multiple API sources with a unified interface. The application can seamlessly switch between:

1. **Mock Data** (for development)
2. **Spoonacular API** (primary recipe source)
3. **TheMealDB API** (free supplementary source)

---

## 🎯 Architecture

### Data Flow

```
┌─────────────────┐
│  Application    │
│  (UI Layer)     │
└────────┬────────┘
         │
         │ getAllRecipes()
         │ searchRecipes()
         │ getRecipeById()
         │
         ▼
┌─────────────────────────┐
│  recipeService.js       │
│  (Data Source Manager)  │
│  • Mock data toggle     │
│  • API routing          │
└────────┬────────────────┘
         │
         ├──► USE_MOCK_DATA = true ──► mockRecipes.js
         │
         └──► USE_MOCK_DATA = false ──┬──► Spoonacular API
                                       │
                                       └──► TheMealDB API
                                              │
                                              ▼
                                       ┌─────────────────┐
                                       │ recipeAdapter.js│
                                       │ (Normalizer)    │
                                       │ • Unified format│
                                       └─────────────────┘
```

---

## 🔧 Configuration

### Switching Between Mock and Real APIs

Open `src/js/recipeService.js` and find:

```javascript
/**
 * Toggle between mock data and real API calls
 * Set to TRUE during development to preserve API call limits
 * Set to FALSE when ready to use real APIs
 */
const USE_MOCK_DATA = true;  // ← Change this
```

**During Development:**
```javascript
const USE_MOCK_DATA = true;  // Use mock data, preserve API calls
```

**For Production/Testing:**
```javascript
const USE_MOCK_DATA = false; // Use real APIs
```

### Adding API Keys

When ready to use real APIs, add your Spoonacular API key:

```javascript
const API_CONFIG = {
  spoonacular: {
    baseUrl: 'https://api.spoonacular.com',
    apiKey: 'YOUR_API_KEY_HERE',  // ← Add your key here
    // ...
  },
  mealDB: {
    // No API key needed - TheMealDB is free!
    baseUrl: 'https://www.themealdb.com/api/json/v1/1',
    // ...
  }
};
```

---

## 🔄 Data Normalization

### Why Normalize?

Spoonacular and TheMealDB return different data structures:

**Spoonacular Response:**
```json
{
  "id": 632250,
  "title": "Tomato Basil Soup",
  "image": "https://...",
  "readyInMinutes": 45,
  "extendedIngredients": [...]
}
```

**TheMealDB Response:**
```json
{
  "idMeal": "52874",
  "strMeal": "Tomato Basil Soup",
  "strMealThumb": "https://...",
  "strIngredient1": "Tomatoes",
  "strMeasure1": "2 cups"
}
```

### Unified Format

The `recipeAdapter.js` normalizes both into:

```javascript
{
  id: string|number,
  title: string,
  image: string,
  readyInMinutes: number,
  servings: number,
  sourceUrl: string,
  vegetarian: boolean,
  vegan: boolean,
  glutenFree: boolean,
  dairyFree: boolean,
  healthScore: number,
  aggregateLikes: number,
  pricePerServing: number,
  extendedIngredients: Array,
  summary: string,
  cuisines: Array,
  dishTypes: Array,
  diets: Array,
  instructions: string,
  source: 'spoonacular'|'mealdb'|'mock'
}
```

This means your UI code doesn't need to know which API the data came from!

---

## 🎨 CSS Animations

The project includes comprehensive animations in `styles.css`:

### Available Animations

| Animation | Use Case | Example |
|-----------|----------|---------|
| `fadeIn` | Recipe cards, content loading | Recipe grid items |
| `slideInRight` | Side panels, notifications | Shopping list panel |
| `slideInLeft` | Navigation menus | Mobile menu |
| `scaleUp` | Modal dialogs | Recipe detail modal |
| `pulse` | Loading states, emphasis | Favorite button when clicked |
| `spin` | Loading spinners | Data fetching indicator |
| `shimmer` | Skeleton loaders | Loading placeholder |
| `bounce` | Success indicators | "Added to favorites" |

### Auto-Applied Animations

```css
/* Recipe cards automatically fade in */
.recipe-card {
  animation: fadeIn 0.5s ease-out;
}

/* Cards appear with staggered delays */
.recipe-card:nth-child(1) { animation-delay: 0s; }
.recipe-card:nth-child(2) { animation-delay: 0.1s; }
.recipe-card:nth-child(3) { animation-delay: 0.2s; }
```

### JavaScript Animation Classes

Add these classes dynamically for effects:

```javascript
// Fade in new content
element.classList.add('animate-fade-in');

// Slide in notification
notification.classList.add('animate-slide-right');

// Pulse on interaction
button.classList.add('animate-pulse');
```

---

## 📖 API Reference

### Main Functions

#### `getAllRecipes()`
Get all available recipes (mock or from APIs)

```javascript
import { getAllRecipes } from './recipeService.js';

const recipes = await getAllRecipes();
// Returns: Array of normalized recipe objects
```

#### `searchRecipes(query, options)`
Search for recipes by name or keyword

```javascript
import { searchRecipes } from './recipeService.js';

const results = await searchRecipes('pasta', {
  number: 20,
  diet: 'vegetarian',
  cuisine: 'italian'
});
```

#### `getRecipeById(id)`
Get detailed information for a specific recipe

```javascript
import { getRecipeById } from './recipeService.js';

const recipe = await getRecipeById(632250);
// Auto-detects if ID is from Spoonacular or TheMealDB
```

#### `getRandomRecipes(count)`
Get random recipes for discovery features

```javascript
import { getRandomRecipes } from './recipeService.js';

const random = await getRandomRecipes(10);
// Returns 10 random recipes (mix from both APIs if live)
```

#### `getRecipesByCategory(category)`
Get recipes from a specific category

```javascript
import { getRecipesByCategory } from './recipeService.js';

const seafood = await getRecipesByCategory('Seafood');
```

---

## 🚀 Development Workflow

### Phase 1: Build with Mock Data
1. Keep `USE_MOCK_DATA = true`
2. Develop all UI features
3. Test with mock data in `mockRecipes.js`
4. No API calls used! 💪

### Phase 2: API Integration
1. Get your Spoonacular API key (free tier: 150 calls/day)
2. Add key to `API_CONFIG.spoonacular.apiKey`
3. Set `USE_MOCK_DATA = false`
4. Test with real data

### Phase 3: Optimization
1. Add caching to reduce API calls
2. Implement rate limiting
3. Mix cached and fresh data

---

## 🔍 API Comparison

### Spoonacular

**Pros:**
- Rich recipe data (nutrition, price, diet tags)
- Advanced search options
- Ingredient-based search
- Great documentation

**Cons:**
- Free tier: 150 calls/day
- Requires API key
- Rate limited

**Best For:** Detailed recipe info, nutrition data, advanced filtering

### TheMealDB

**Pros:**
- Completely FREE (no limits!)
- No API key required
- Good recipe variety
- Category browsing

**Cons:**
- Less detailed data
- No nutrition info
- No pricing data
- Simpler search

**Best For:** Recipe discovery, category browsing, supplementing Spoonacular

---

## 🎯 Usage Examples

### Example 1: Homepage Recipe Grid

```javascript
// main.js
import { getAllRecipes } from './js/recipeService.js';

async function loadHomepage() {
  const recipes = await getAllRecipes();
  
  recipes.forEach(recipe => {
    const card = createRecipeCard(recipe);
    grid.appendChild(card);
  });
  
  // Cards will automatically animate in!
}
```

### Example 2: Search Feature

```javascript
// search.js
import { searchRecipes } from './js/recipeService.js';

async function handleSearch(query) {
  const results = await searchRecipes(query);
  
  if (results.length === 0) {
    showNoResults();
  } else {
    displayResults(results);
  }
}
```

### Example 3: Recipe Details Modal

```javascript
// recipeDetails.js
import { getRecipeById } from './js/recipeService.js';

async function showRecipeModal(recipeId) {
  const recipe = await getRecipeById(recipeId);
  
  const modal = document.querySelector('.modal-box');
  modal.innerHTML = `
    <h2>${recipe.title}</h2>
    <img src="${recipe.image}" alt="${recipe.title}">
    <p>${recipe.summary}</p>
    <!-- Modal animates with scaleUp automatically -->
  `;
  
  modal.classList.add('animate-scale-up');
}
```

---

## 🐛 Troubleshooting

### "Using mock data" appears in console

✅ This is expected when `USE_MOCK_DATA = true`

To use real APIs, set it to `false` and add your API key.

### API returns empty array

Check:
1. API key is correct
2. Internet connection is active
3. API rate limit not exceeded
4. Check browser console for errors

### Animations not working

Verify:
1. `styles.css` is linked in HTML
2. Elements have correct class names
3. No CSS conflicts overriding animations

### Different data from two APIs

✅ This is normal! The adapter normalizes them, but some fields may be empty from TheMealDB (like `pricePerServing`).

---

## 📊 Project Requirements Checklist

✅ **Vanilla JavaScript** - No frameworks used
✅ **Two External APIs** - Spoonacular + TheMealDB
✅ **CSS Animations** - Comprehensive set in styles.css
✅ **ES Modules** - Organized with imports/exports
✅ **Clean Code** - Documented with JSDoc comments
✅ **Static + Dynamic** - Mix of HTML and JS-generated content
✅ **Best Practices** - Separation of concerns, DRY principles

---

## 🎓 Key Concepts

### Why This Architecture?

1. **Flexibility**: Switch data sources without changing UI code
2. **Development Speed**: Build features without wasting API calls
3. **Resilience**: If one API fails, the other can still work
4. **Scalability**: Easy to add more data sources later

### Pattern: Adapter Pattern

The `recipeAdapter.js` implements the Adapter Pattern:
- **Problem**: Two APIs with different structures
- **Solution**: Normalize to a common format
- **Benefit**: UI doesn't care where data comes from

---

## 📚 Additional Resources

- [Spoonacular API Docs](https://spoonacular.com/food-api/docs)
- [TheMealDB API Docs](https://www.themealdb.com/api.php)
- [CSS Animations Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

## 🎉 You're Ready!

You now have:
- ✅ Comprehensive CSS animations
- ✅ Mock data toggle for development
- ✅ Unified interface for two APIs
- ✅ Normalized data structure
- ✅ Easy configuration

Start building with `USE_MOCK_DATA = true`, and when ready for production, flip the switch to `false`!

Happy coding! 👨‍🍳👩‍🍳
