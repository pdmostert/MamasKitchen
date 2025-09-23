// Simple main application file
import { mockRecipes } from "./mockRecipes.js";
import { storage } from "./utils.js";
import { toast } from "./utils.js";
import { createMealPlan } from "./mealPlan.mjs";

// Simple app state
const app = {
  currentView: "meal-plan",
  favorites: [],
  mealPlan: {},
  selectedRecipe: null,
};

// Initialize the app
function initApp() {
  // Load saved data
  app.favorites = storage.getFavorites() || [];
  app.mealPlan = storage.getMealPlan() || {};

  // Show the meal plan by default
  showMealPlan();

  // Listen for navigation changes
  window.addEventListener("viewChanged", (event) => {
    const newView = event.detail.view;
    changeView(newView);
  });
}

// Change to a different view
function changeView(viewName) {
  app.currentView = viewName;

  switch (viewName) {
    case "meal-plan":
      showMealPlan();
      break;
    case "search":
      showSearch();
      break;
    case "favorites":
      showFavorites();
      break;
    case "shopping":
      showShopping();
      break;
    case "nutrition":
      showNutrition();
      break;
    default:
      showMealPlan();
  }
}

// Show the meal plan
function showMealPlan() {
  const appContainer = document.getElementById("app");

  // Create main content container
  const main = document.createElement("main");
  main.className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8";

  // Create the meal plan component
  const mealPlan = createMealPlan(
    app.mealPlan,
    removeMealFromPlan,
    handleAddMeal,
    viewRecipeDetails
  );

  main.appendChild(mealPlan);
  appContainer.innerHTML = "";
  appContainer.appendChild(main);
}

// Show search (placeholder)
function showSearch() {
  const appContainer = document.getElementById("app");
  appContainer.innerHTML = `
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Search Recipes</h2>
      <p class="text-gray-600">Search functionality coming soon!</p>
    </main>
  `;
}

// Show favorites (placeholder)
function showFavorites() {
  const appContainer = document.getElementById("app");
  appContainer.innerHTML = `
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Favorite Recipes</h2>
      <p class="text-gray-600">Favorites functionality coming soon!</p>
    </main>
  `;
}

// Show shopping list (placeholder)
function showShopping() {
  const appContainer = document.getElementById("app");
  appContainer.innerHTML = `
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Shopping List</h2>
      <p class="text-gray-600">Shopping list functionality coming soon!</p>
    </main>
  `;
}

// Show nutrition (placeholder)
function showNutrition() {
  const appContainer = document.getElementById("app");
  appContainer.innerHTML = `
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Nutrition Info</h2>
      <p class="text-gray-600">Nutrition functionality coming soon!</p>
    </main>
  `;
}

// Handle adding a meal
function handleAddMeal(day, mealType) {
  toast.info(`Click to add a ${mealType} for ${day}`);
  // You can add meal selection logic here later
}

// Handle removing a meal
function removeMealFromPlan(day, mealType) {
  if (app.mealPlan[day] && app.mealPlan[day][mealType]) {
    const meal = app.mealPlan[day][mealType];
    delete app.mealPlan[day][mealType];

    // Clean up empty days
    if (Object.keys(app.mealPlan[day]).length === 0) {
      delete app.mealPlan[day];
    }

    // Save and refresh
    storage.setMealPlan(app.mealPlan);
    showMealPlan();
    toast.success(`Removed ${meal.title} from meal plan`);
  }
}

// Handle viewing recipe details
function viewRecipeDetails(recipe) {
  toast.info(`Viewing details for: ${recipe.title}`);
  // You can add recipe details modal here later
}

// Save data to localStorage
function saveData() {
  storage.setFavorites(app.favorites);
  storage.setMealPlan(app.mealPlan);
}

// Start the app when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Wait a bit for partials to load, then init app
  setTimeout(initApp, 100);
});
