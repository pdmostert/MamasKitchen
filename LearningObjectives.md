# Learning Objectives - Mama's Kitchen Project

This document maps each learning objective from the TaskList.md to specific implementations in the Mama's Kitchen codebase.

---

## JavaScript (25%) - Robust Programming Logic

### 1. **Validating Screen Data**

**Location:** `src/js/search.mjs` (lines 96-102)

```javascript
showAddToPlanModal(recipe) {
  // Validation logic in modal submit handler
  const day = document.getElementById("modal-day-select").value;
  const mealType = document.getElementById("modal-mealtype-select").value;
  if (!day || !mealType) {
    toast.error("Please select both day and meal type.");
    return;
  }
}
```

**Description:** Validates user input before adding a recipe to the meal plan, ensuring both day and meal type are selected.

**Location:** `src/js/recipeService.js` (lines 24-35)

```javascript
if (!SPOONACULAR_API_KEY) {
  toast.error("Recipe search is not configured. Please add an API key.");
  return [];
}
```

**Description:** Validates API configuration before making requests.

---

### 2. **Looping Through Array of JSON Data**

**Location:** `src/js/shoppingView.mjs` (lines 31-49)

```javascript
extractIngredients() {
  const ingredients = [];

  // Loop through each day
  Object.keys(this.mealPlan).forEach((day) => {
    // Loop through each meal type (breakfast, lunch, dinner, snack)
    Object.keys(this.mealPlan[day]).forEach((mealType) => {
      const recipe = this.mealPlan[day][mealType];

      // Get ingredients from extendedIngredients (Spoonacular format)
      if (recipe && Array.isArray(recipe.extendedIngredients)) {
        recipe.extendedIngredients.forEach((ingredient) => {
          ingredients.push({...});
        });
      }
    });
  });

  return ingredients;
}
```

**Description:** Nested loops iterate through the meal plan structure (days → meals → ingredients) to extract all ingredients.

**Location:** `src/js/search.mjs` (lines 146-152)

```javascript
renderList(recipes) {
  const recipeList = Array.isArray(recipes) ? recipes : recipes.recipes || [];
  recipeList.forEach((r) => {
    const card = this.createRecipeCard(r);
    grid.appendChild(card);
  });
}
```

**Description:** Loops through array of recipe objects to render recipe cards on screen.

**Location:** `src/js/shoppingView.mjs` (lines 71-87)

```javascript
groupByAisle(ingredients) {
  const grouped = {};

  ingredients.forEach((ingredient) => {
    const aisle = ingredient.aisle;
    if (!grouped[aisle]) {
      grouped[aisle] = [];
    }
    // Logic to combine duplicate ingredients
  });

  return grouped;
}
```

**Description:** Loops through ingredients to group by aisle and combine duplicates with matching units.

---

### 3. **Creating and Using Events**

**Location:** `src/js/utils.js` (lines 103-131)

```javascript
loadHeaderFooter() {
  // Mobile menu toggle functionality
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenuDropdown = document.getElementById("mobile-menu-dropdown");

  if (mobileMenuButton && mobileMenuDropdown) {
    // Toggle menu on button click
    mobileMenuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenuDropdown.classList.toggle("open");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileMenuButton.contains(e.target) &&
          !mobileMenuDropdown.contains(e.target)) {
        mobileMenuDropdown.classList.remove("open");
      }
    });

    // Close menu when clicking a nav link
    const mobileNavLinks = mobileMenuDropdown.querySelectorAll(".mobile-nav-btn");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuDropdown.classList.remove("open");
      });
    });
  }
}
```

**Description:** Multiple event listeners for mobile menu: button click, click outside, and navigation link clicks.

**Location:** `src/js/search.mjs` (lines 210-214)

```javascript
renderSearchHeader() {
  searchInput.addEventListener("input", () => {
    const filtered = this.filterRecipes(searchInput.value);
    this.renderList(filtered);
  });
}
```

**Description:** Input event listener for real-time search filtering.

**Location:** `src/js/shoppingView.mjs` (lines 116-124)

```javascript
createIngredientItem(ingredient, index, aisle) {
  checkbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      label.classList.add("checked");
    } else {
      label.classList.remove("checked");
    }
  });
}
```

**Description:** Change event on checkbox to toggle strikethrough styling on ingredients.

**Location:** `src/js/mealPlan.mjs` (lines 189-195)

```javascript
init() {
  this.render();

  // Re-render on window resize to switch between mobile/desktop layouts
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      this.render();
    }, 250); // Debounce resize events
  });
}
```

**Description:** Resize event with debouncing to handle responsive layout switching.

**Location:** `src/js/mealPlan.js` (lines 9)

```javascript
document.addEventListener("DOMContentLoaded", init);
```

**Description:** DOMContentLoaded event to initialize the meal planner after page load.

---

### 4. **Changing Element Styles with JavaScript**

**Location:** `src/js/shoppingView.mjs` (lines 118-122)

```javascript
checkbox.addEventListener("change", (e) => {
  if (e.target.checked) {
    label.classList.add("checked"); // Adds strikethrough styling
  } else {
    label.classList.remove("checked");
  }
});
```

**Description:** Dynamically adds/removes CSS class to apply strikethrough styling to checked ingredients.

**Location:** `src/js/RecipeCard.mjs` (lines 144-158)

```javascript
createFavoriteButton(recipe, favorites) {
  // Set initial state
  favBtn.className = "favorite-btn " +
    (isFavorite ? "favorite-active" : "favorite-inactive");

  // Toggle favorite on click
  favBtn.addEventListener("click", () => {
    if (isCurrentlyFavorite) {
      favBtn.className = "favorite-btn favorite-inactive";
      favBtn.innerHTML = "♡ Favorite";
    } else {
      favBtn.className = "favorite-btn favorite-active";
      favBtn.innerHTML = "♥ Favorites";
    }
  });
}
```

**Description:** Changes button class and content based on favorite state (active/inactive styling).

---

### 5. **Changing Element Classes to Use Different CSS Rules**

**Location:** `src/js/utils.js` (lines 88-97)

```javascript
loadHeaderFooter() {
  navLinks.forEach((link) => {
    let linkPath = link.getAttribute("href").replace(/\/index\.html$/, "/");
    if (linkPath === currentPath) {
      link.classList.add("nav-active");
      link.classList.remove("nav-inactive");
    } else {
      link.classList.remove("nav-active");
      link.classList.add("nav-inactive");
    }
  });
}
```

**Description:** Toggles navigation link classes to highlight the active page.

**Location:** `src/js/utils.js` (lines 110)

```javascript
mobileMenuDropdown.classList.toggle("open");
```

**Description:** Toggles "open" class to show/hide mobile dropdown menu with animation.

---

## Third-party APIs (15%) - Effective Use of APIs

### 1. **Spoonacular API - Complex Search**

**Location:** `src/js/recipeService.js` (lines 14-59)

```javascript
async function searchSpoonacularRecipes(query, options = {}) {
  const params = new URLSearchParams({
    apiKey: SPOONACULAR_API_KEY,
    query: query,
    number: options.number || 10,
    addRecipeInformation: true,
    fillIngredients: true,
    ...(options.diet && { diet: options.diet }),
    ...(options.cuisine && { cuisine: options.cuisine }),
    ...(options.type && { type: options.type }),
  });

  const response = await fetch(
    `${SPOONACULAR_BASE_URL}/recipes/complexSearch?${params}`
  );

  if (!response.ok) {
    if (response.status === 402) {
      toast.error("API limit reached. Please try again later.");
    } else if (response.status === 401) {
      toast.error("Invalid API key. Please check your configuration.");
    } else {
      toast.error("Failed to search recipes. Please try again.");
    }
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}
```

**Description:** Uses Spoonacular API with multiple parameters (query, diet, cuisine, type) and handles error states (402, 401, network errors). Includes rich JSON data with recipe information and ingredients.

---

### 2. **Spoonacular API - Random Recipes**

**Location:** `src/js/recipeService.js` (lines 65-98)

```javascript
async function getRandomSpoonacularRecipes(count = 10) {
  const response = await fetch(
    `${SPOONACULAR_BASE_URL}/recipes/random?apiKey=${SPOONACULAR_API_KEY}&number=${count}`
  );

  if (!response.ok) {
    // Error handling with user-friendly messages
  }

  const data = await response.json();
  return data.recipes || [];
}
```

**Description:** Fetches random recipes from Spoonacular for meal plan inspiration.

---

### 3. **MealDB API - Recipe Inspiration**

**Location:** `src/js/inspiration.mjs` (lines 15-35)

```javascript
async fetchRecipeInspiration() {
  try {
    // Get 3 random recipes for variety
    const recipes = [];
    for (let i = 0; i < 3; i++) {
      const response = await fetch(`${MEALDB_API_URL}/random.php`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        recipes.push(data.meals[0]);
      }
    }

    this.data.inspirationRecipes = recipes;
  } catch (error) {
    toast.show("Could not load recipe inspiration", "error");
  }
}
```

**Description:** Uses TheMealDB API to fetch random recipe inspiration. Makes multiple API calls to provide variety.

---

### 4. **Dynamic API Integration Based on User Actions**

**Location:** `src/js/search.js` (lines 14-35)

```javascript
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const typeFilter = urlParams.get("type");
  const day = urlParams.get("day");
  const meal = urlParams.get("meal");

  let recipes;

  // If there's a type filter, fetch recipes from Spoonacular for that type
  if (typeFilter) {
    if (day && meal) {
      toast.info(`Finding ${meal} recipes for ${day}...`);
    }

    const queryMap = {
      breakfast: "breakfast",
      "main course": "main course lunch dinner",
      snack: "snack appetizer",
    };
    const searchQuery = queryMap[typeFilter] || typeFilter;

    recipes = await searchRecipes(searchQuery, {
      number: 30,
      type: typeFilter,
    });

    if (recipes.length > 0) {
      toast.success(`Found ${recipes.length} ${typeFilter} recipes!`);
    }
  } else {
    recipes = await getAllRecipes();
  }
}
```

**Description:** Dynamically fetches different recipes based on URL parameters (meal type, day) when user clicks "Add Meal" from the meal planner. Shows context-aware API calls.

---

## JSON (15%) - Processing JSON Data

### 1. **Extracting Nested JSON Data**

**Location:** `src/js/shoppingView.mjs` (lines 31-49)

```javascript
extractIngredients() {
  const ingredients = [];

  Object.keys(this.mealPlan).forEach((day) => {
    Object.keys(this.mealPlan[day]).forEach((mealType) => {
      const recipe = this.mealPlan[day][mealType];

      // Process Spoonacular's extendedIngredients JSON structure
      if (recipe && Array.isArray(recipe.extendedIngredients)) {
        recipe.extendedIngredients.forEach((ingredient) => {
          ingredients.push({
            name: ingredient.nameClean || ingredient.name || ingredient.original,
            amount: ingredient.amount || 0,
            unit: ingredient.unit || "",
            aisle: ingredient.aisle || "Other",
            original: ingredient.original,
          });
        });
      }
    });
  });

  return ingredients;
}
```

**Description:** Processes complex nested JSON structure from meal plan and Spoonacular API, extracting ingredient data including name, amount, unit, and aisle information.

---

### 2. **Storing and Retrieving JSON from LocalStorage**

**Location:** `src/js/utils.js` (lines 135-172)

```javascript
export const storage = {
  getFavorites: () => {
    try {
      const saved = localStorage.getItem("mealPlannerFavorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  setFavorites: (favorites) => {
    try {
      localStorage.setItem("mealPlannerFavorites", JSON.stringify(favorites));
    } catch (_error) {
      // ignore storage write errors
    }
  },

  getMealPlan: () => {
    try {
      const saved = localStorage.getItem("mealPlannerMealPlan");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  },

  setMealPlan: (mealPlan) => {
    try {
      localStorage.setItem("mealPlannerMealPlan", JSON.stringify(mealPlan));
    } catch (_error) {
      // ignore storage write errors
    }
  },
};
```

**Description:** Handles JSON serialization/deserialization for localStorage operations. Includes error handling for parsing failures.

---

### 3. **Transforming JSON Data for Display**

**Location:** `src/js/shoppingView.mjs` (lines 71-96)

```javascript
groupByAisle(ingredients) {
  const grouped = {};

  ingredients.forEach((ingredient) => {
    const aisle = ingredient.aisle;

    if (!grouped[aisle]) {
      grouped[aisle] = [];
    }

    // Check if ingredient already exists in this aisle
    const existing = grouped[aisle].find(
      (item) => item.name.toLowerCase() === ingredient.name.toLowerCase()
    );

    if (existing) {
      // Combine amounts if same unit
      if (existing.unit === ingredient.unit) {
        existing.amount += ingredient.amount;
      } else {
        // Different units - just add as separate item
        grouped[aisle].push(ingredient);
      }
    } else {
      grouped[aisle].push(ingredient);
    }
  });

  return grouped;
}
```

**Description:** Transforms flat array of ingredient JSON objects into grouped structure organized by aisle, combining duplicate ingredients intelligently.

---

### 4. **Mapping JSON Arrays to HTML Elements**

**Location:** `src/js/RecipeCard.mjs` (lines 42-58)

```javascript
create(recipe, options = {}) {
  // Extract data from recipe JSON object
  const meta = document.createElement("div");
  meta.className = "recipe-meta";
  meta.innerHTML = `
    <span class="muted">${recipe.readyInMinutes}m</span>
    &nbsp;•&nbsp;
    <span class="muted">${recipe.servings}p</span>
  `;

  // Tags (diets, dish types, cuisines)
  const tagsRow = document.createElement("div");
  tagsRow.className = "recipe-tags";
  const tags = [
    ...(recipe.diets || []),
    ...(recipe.dishTypes || []),
    ...(recipe.cuisines || []),
  ];
  tags.forEach((t) => {
    tagsRow.appendChild(this.createTag(t));
  });
}
```

**Description:** Extracts data from recipe JSON object and transforms into HTML elements, combining multiple arrays (diets, dishTypes, cuisines) into tag elements.

---

### 5. **URL Parameter JSON Handling**

**Location:** `src/js/search.mjs` (lines 34-44)

```javascript
getUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  return {
    type: params.get("type") || "",
    query: params.get("q") || "",
    day: params.get("day") || "",
    meal: params.get("meal") || "",
  };
}
```

**Description:** Parses URL parameters into JSON object for filtering recipes based on navigation context.

---

## CSS (15%) - Transforms, Transitions, and Styling

### 1. **CSS Transforms - Image Zoom on Hover**

**Location:** `src/styles/styles.css` (lines 706-718)

```css
/* Image zoom on hover - smooth and subtle */
.recipe-image-wrapper {
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.recipe-image {
  transition: transform 0.4s ease;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.08);
}
```

**Description:** Uses CSS transform to scale recipe images on hover, creating a zoom effect with smooth transition.

---

### 2. **CSS Transitions - Button Hover Effects**

**Location:** `src/styles/styles.css` (lines 12-19)

```css
.favorite-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}

.favorite-btn:hover {
  background: #c4b5fd;
  color: #fff;
}
```

**Description:** Smooth color transitions on button hover for better user feedback.

---

### 3. **CSS Transitions - Input Field Focus**

**Location:** `src/styles/styles.css` (lines 581-588)

```css
.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #6b7280;
  box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
}
```

**Description:** Input field expands focus ring with smooth transition, providing visual feedback.

---

### 4. **CSS Animations - Dropdown Menu**

**Location:** `src/styles/styles.css` (lines 417-437)

```css
.mobile-menu-dropdown {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.mobile-menu-dropdown.open {
  display: block;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Description:** Custom slideDown animation for mobile menu dropdown using keyframes, transform, and opacity.

---

### 5. **CSS Transitions - Toast Notifications**

**Location:** `src/styles/styles.css` (lines 503-523)

```css
.toast {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateX(120%);
  transition:
    transform 300ms ease,
    opacity 300ms ease;
  opacity: 1;
}

.toast-enter {
  transform: translateX(0%);
}

.toast-exit {
  transform: translateX(120%);
  opacity: 0;
}
```

**Description:** Toast notifications slide in from the right using transform and opacity transitions.

---

### 6. **CSS Subtle Styling - Rounded Corners, Shadows, Borders**

**Location:** `src/styles/styles.css` (lines 613-626)

```css
.recipe-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
  border: 1px solid #e5e7eb;
}

.recipe-card:hover {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  border-color: #d1d5db;
}
```

**Description:** Recipe cards use rounded corners (border-radius), subtle shadows (box-shadow), borders, and transition effects to enhance visual appeal.

---

### 7. **CSS Transform - Mobile Menu Button Scale**

**Location:** `src/styles/styles.css` (lines 392-403)

```css
.mobile-menu-button {
  background: none;
  border: none;
  font-size: 1.75rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #1f2937;
  transition: transform 0.2s;
}

.mobile-menu-button:hover {
  transform: scale(1.1);
}

.mobile-menu-button:active {
  transform: scale(0.95);
}
```

**Description:** Mobile menu button scales up on hover and down on click using CSS transforms.

---

## Events (15%) - Enhancing User Experience

### 1. **Click Events - Mobile Menu Toggle**

**Location:** `src/js/utils.js` (lines 106-131)

```javascript
// Toggle menu on button click
mobileMenuButton.addEventListener("click", (e) => {
  e.stopPropagation();
  mobileMenuDropdown.classList.toggle("open");
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    !mobileMenuButton.contains(e.target) &&
    !mobileMenuDropdown.contains(e.target)
  ) {
    mobileMenuDropdown.classList.remove("open");
  }
});

// Close menu when clicking a nav link
const mobileNavLinks = mobileMenuDropdown.querySelectorAll(".mobile-nav-btn");
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenuDropdown.classList.remove("open");
  });
});
```

**Description:** Multiple click event handlers create smooth mobile navigation experience (toggle, close on outside click, auto-close on link click).

---

### 2. **Input Events - Real-time Search Filtering**

**Location:** `src/js/search.mjs` (lines 210-214)

```javascript
renderSearchHeader() {
  searchInput.addEventListener("input", () => {
    const filtered = this.filterRecipes(searchInput.value);
    this.renderList(filtered);
  });
}
```

**Description:** Input event provides instant feedback as user types in search box.

---

### 3. **Change Events - Shopping List Checkboxes**

**Location:** `src/js/shoppingView.mjs` (lines 116-124)

```javascript
createIngredientItem(ingredient, index, aisle) {
  checkbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      label.classList.add("checked");
    } else {
      label.classList.remove("checked");
    }
  });
}
```

**Description:** Change event on checkboxes applies strikethrough styling to checked ingredients.

---

### 4. **Resize Events - Responsive Layout Switching**

**Location:** `src/js/mealPlan.mjs` (lines 189-195)

```javascript
init() {
  this.render();

  // Re-render on window resize to switch between mobile/desktop layouts
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      this.render();
    }, 250); // Debounce resize events
  });
}
```

**Description:** Resize event with debouncing automatically switches between mobile and desktop layouts for optimal viewing.

---

### 5. **DOMContentLoaded Events - Page Initialization**

**Location:** `src/js/search.js` (lines 4)

```javascript
document.addEventListener("DOMContentLoaded", async () => {
  loadHeaderFooter();

  // Check URL parameters and fetch appropriate recipes
  const urlParams = new URLSearchParams(window.location.search);
  const typeFilter = urlParams.get("type");

  let recipes;
  if (typeFilter) {
    recipes = await searchRecipes(searchQuery, {
      number: 30,
      type: typeFilter,
    });
  } else {
    recipes = await getAllRecipes();
  }

  const searchView = new SearchView("main", recipes, {}, favorites);
  searchView.render();
});
```

**Description:** DOMContentLoaded ensures page elements are ready before initialization, loads header/footer, and fetches initial data.

---

### 6. **Click Events - Recipe Actions**

**Location:** `src/js/RecipeCard.mjs` (lines 83-99)

```javascript
// View Recipe button
const viewBtn = document.createElement("button");
viewBtn.className = "nav-btn";
viewBtn.textContent = "View Recipe";
viewBtn.addEventListener("click", () => showRecipeDetailsModal(recipe));
actions.appendChild(viewBtn);

// Add to Plan button
if (showAddToPlan && onAddToPlan) {
  const addBtn = document.createElement("button");
  addBtn.className = "nav-btn primary";
  addBtn.textContent = "Add to Plan";
  addBtn.addEventListener("click", () => onAddToPlan(recipe));
  actions.appendChild(addBtn);
}
```

**Description:** Click events on recipe card buttons trigger modals and actions (view details, add to plan, toggle favorite).

---

## Local Storage (5%) - Effective Storage Usage

### 1. **Favorites Persistence**

**Location:** `src/js/utils.js` (lines 135-149)

```javascript
export const storage = {
  getFavorites: () => {
    try {
      const saved = localStorage.getItem("mealPlannerFavorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  setFavorites: (favorites) => {
    try {
      localStorage.setItem("mealPlannerFavorites", JSON.stringify(favorites));
    } catch (_error) {
      // ignore storage write errors
    }
  },
};
```

**Description:** Stores and retrieves user's favorite recipes with error handling for parse failures and storage quota issues.

**Usage:** `src/js/RecipeCard.mjs` (lines 150-169)

```javascript
createFavoriteButton(recipe, favorites) {
  favBtn.addEventListener("click", () => {
    let currentFavorites = storage.getFavorites() || [];
    const isCurrentlyFavorite = currentFavorites.some(
      (fav) => fav.id === recipe.id
    );

    if (isCurrentlyFavorite) {
      currentFavorites = currentFavorites.filter(
        (fav) => fav.id !== recipe.id
      );
      toast.info(`Removed ${recipe.title} from favorites`);
    } else {
      currentFavorites.push(recipe);
      toast.success(`Added ${recipe.title} to favorites`);
    }

    storage.setFavorites(currentFavorites);
  });
}
```

**Description:** Updates localStorage when user adds/removes favorites, persisting preferences across sessions.

---

### 2. **Meal Plan Persistence**

**Location:** `src/js/utils.js` (lines 151-172)

```javascript
getMealPlan: () => {
  try {
    const saved = localStorage.getItem("mealPlannerMealPlan");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
},

setMealPlan: (mealPlan) => {
  try {
    localStorage.setItem("mealPlannerMealPlan", JSON.stringify(mealPlan));
  } catch (_error) {
    // ignore storage write errors
  }
},
```

**Description:** Persists weekly meal plan with complex nested structure (days → meal types → recipes).

**Usage:** `src/js/search.mjs` (lines 96-112)

```javascript
showAddToPlanModal(recipe) {
  addBtn.onclick = () => {
    const day = document.getElementById("modal-day-select").value;
    const mealType = document.getElementById("modal-mealtype-select").value;

    let mealPlan = {};
    try {
      mealPlan = JSON.parse(localStorage.getItem("mealPlannerMealPlan")) || {};
    } catch {
      mealPlan = {};
    }

    if (!mealPlan[day]) mealPlan[day] = {};
    mealPlan[day][mealType] = recipe;

    localStorage.setItem("mealPlannerMealPlan", JSON.stringify(mealPlan));
    toast.success(`Added ${recipe.title} to ${day} ${mealType}`);
  };
}
```

**Description:** Reads from and writes to localStorage when adding meals to the weekly plan.

---

### 3. **Shopping List Generation from Stored Data**

**Location:** `src/js/shoppingView.mjs` (lines 23-27)

```javascript
export default class ShoppingView {
  constructor(containerId = "main") {
    this.container = document.getElementById(containerId);
    this.mealPlan = storage.getMealPlan() || {}; // Load from localStorage
    this.shoppingList = {};
  }
}
```

**Description:** Retrieves meal plan from localStorage to dynamically generate shopping list, demonstrating cross-feature data sharing.

---

### 4. **Error Handling for Storage Operations**

**Location:** `src/js/utils.js` (lines 135-172)

```javascript
getFavorites: () => {
  try {
    const saved = localStorage.getItem("mealPlannerFavorites");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];  // Gracefully handle parse errors or disabled storage
  }
},

setFavorites: (favorites) => {
  try {
    localStorage.setItem("mealPlannerFavorites", JSON.stringify(favorites));
  } catch (_error) {
    // ignore storage write errors in browsers where storage may be disabled
  }
},
```

**Description:** All localStorage operations wrapped in try-catch blocks to handle quota exceeded errors, parse failures, and disabled storage scenarios.

---

## Summary

This project demonstrates comprehensive full-stack frontend development skills:

- **JavaScript**: Complex logic including validation, nested loops, event handling, DOM manipulation, and class-based architecture
- **APIs**: Integration with 2 third-party APIs (Spoonacular and MealDB) with error handling and dynamic parameter passing
- **JSON**: Processing, transforming, and storing complex nested JSON structures
- **CSS**: Modern animations (slideDown), transforms (scale, zoom), transitions (hover effects, focus states), and responsive design
- **Events**: Multiple event types (click, input, change, resize, DOMContentLoaded) enhancing UX
- **LocalStorage**: Persistent data storage for favorites and meal plans with robust error handling

**Total Files:** 20+ JavaScript/HTML/CSS files
**Lines of Code:** ~2,500+ lines
**Key Features:** Meal planning, recipe search, favorites management, shopping list generation, mobile-responsive design
