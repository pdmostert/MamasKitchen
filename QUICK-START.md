# Mama's Kitchen - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Understand the Setup ✅

Your project now has **smart API management**:

```
🎯 Current Mode: DEVELOPMENT (Mock Data)
📦 USE_MOCK_DATA = true
💰 API Calls Used: 0
```

### Step 2: Start Building 🛠️

Use these functions in your code:

```javascript
import { getAllRecipes, searchRecipes, getRecipeById } from './js/recipeService.js';

// Example: Load homepage recipes
async function init() {
  const recipes = await getAllRecipes();
  recipes.forEach(recipe => {
    displayRecipe(recipe); // Your display function
  });
}
```

### Step 3: Switch to Production 🌐

When ready to test with real data:

```javascript
// In recipeService.js, change:
const USE_MOCK_DATA = false;

// And add your API key:
const API_CONFIG = {
  spoonacular: {
    apiKey: 'YOUR_KEY_HERE',
  }
};
```

---

## 📂 New Files Created

| File | Purpose |
|------|---------|
| `recipeAdapter.js` | Normalizes data from different APIs |
| `recipeService.js` | Enhanced with API integration |
| `API-INTEGRATION-GUIDE.md` | Complete documentation |
| `recipeService.example.js` | Code examples |
| `IMPLEMENTATION-SUMMARY.md` | What we built |

---

## 🎨 Animations Now Available

Just add these classes to elements:

```html
<!-- Fade in -->
<div class="animate-fade-in">Content</div>

<!-- Slide from right -->
<div class="animate-slide-right">Notification</div>

<!-- Pulse effect -->
<button class="animate-pulse">Click me!</button>

<!-- Auto-animated recipe cards -->
<div class="recipe-card">Will fade in automatically!</div>
```

---

## 🔍 Two APIs Integrated

### Spoonacular (Primary)
- Rich recipe data
- Nutrition info
- 150 calls/day free
- **Needs API key**

### TheMealDB (Secondary)
- Free, unlimited
- Good recipe variety
- **No API key needed!**

Both APIs work together seamlessly through the adapter!

---

## ✅ Requirements Met

| Requirement | Status |
|------------|--------|
| Vanilla JavaScript | ✅ |
| Two External APIs | ✅ |
| Not OpenWeatherMap | ✅ |
| CSS Animations | ✅ |
| ES Modules | ✅ |
| Clean Code | ✅ |

---

## 🎯 Quick Commands

```javascript
// Get all recipes
const recipes = await getAllRecipes();

// Search
const results = await searchRecipes('chicken');

// Get one recipe
const recipe = await getRecipeById(123);

// Random recipes
const random = await getRandomRecipes(10);

// Check mode
if (isUsingMockData()) {
  console.log('Using mock data');
}
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────┐
│      Your UI Code           │
│   (main.js, search.js)      │
└──────────┬──────────────────┘
           │
           │ getAllRecipes()
           │ searchRecipes()
           │
           ▼
┌─────────────────────────────┐
│    recipeService.js         │
│                             │
│  USE_MOCK_DATA?            │
│         │                   │
│    ┌────┴────┐             │
│    │         │             │
│   YES        NO            │
│    │         │             │
└────┼─────────┼─────────────┘
     │         │
     │         ├─► Spoonacular API
     │         └─► TheMealDB API
     │                │
     ▼                ▼
  mockRecipes    recipeAdapter
     │                │
     │    Normalize   │
     │    to unified  │
     │    format      │
     │                │
     └────────┬───────┘
              │
              ▼
       Consistent Data
       to Your UI!
```

---

## 💡 Pro Tips

1. **During Development**: Keep `USE_MOCK_DATA = true`
2. **Before Submission**: Test with `USE_MOCK_DATA = false`
3. **Check Console**: Logs show which mode you're in
4. **Save API Calls**: Build everything with mock data first

---

## 🐛 Troubleshooting

### "Using mock data" in console?
✅ Normal! That means you're in development mode.

### Want to test real APIs?
1. Get Spoonacular API key
2. Add to `API_CONFIG.spoonacular.apiKey`
3. Set `USE_MOCK_DATA = false`

### Animations not working?
- Check `styles.css` is linked
- Verify element has correct class
- Open browser DevTools to check CSS

---

## 📚 Read More

- **API-INTEGRATION-GUIDE.md** - Full documentation
- **IMPLEMENTATION-SUMMARY.md** - What we built
- **recipeService.example.js** - Code examples

---

## 🎉 You're Ready!

Your project has:
- ✅ Smart API switching
- ✅ Beautiful animations
- ✅ Two APIs ready to go
- ✅ Clean, documented code

**Start building with mock data, switch to real APIs when ready!**

---

**Questions? Check the documentation files or console.log() to see what's happening!**
