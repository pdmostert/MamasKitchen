import { storage, toast } from "./utils.js";

const MEALDB_API_URL = "https://www.themealdb.com/api/json/v1/1";

export default class InspirationView {
  constructor(containerId = "app") {
    this.data = {
      inspirationRecipes: [],
    };

    this.container = document.getElementById(containerId);
  }

  // Fetch random recipe inspiration
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
      // console.log("Fetched inspiration recipes:", recipes);
    } catch (error) {
      // console.error("Error fetching recipe inspiration:", error);
      toast.show("Could not load recipe inspiration", "error");
    }
  }

  // Render the inspiration view
  render() {
    const recipesHtml = this.data.inspirationRecipes
      .map(
        (recipe) => `
      <div class="inspiration-card">
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-image">
        <div class="recipe-info">
          <h3>${recipe.strMeal}</h3>
          <p class="recipe-category">
            <span class="badge">${recipe.strCategory}</span>
            <span class="badge">${recipe.strArea}</span>
          </p>
          <a href="${recipe.strSource || recipe.strYoutube}" target="_blank" class="btn-primary">
            View Full Recipe
          </a>
        </div>
      </div>
    `
      )
      .join("");

    this.container.innerHTML = `
      <div class="inspiration-container">
        <h2>🎨 Recipe Inspiration</h2>
        <p class="subtitle">Discover new recipes to add to your meal plan</p>
        
        <div class="inspiration-grid">
          ${recipesHtml || "<p>Loading inspiration...</p>"}
        </div>
        
        <button id="refresh-inspiration" class="btn-secondary">
          🔄 Get More Ideas
        </button>
      </div>
    `;

    // Add refresh button functionality
    const refreshBtn = document.getElementById("refresh-inspiration");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", async () => {
        refreshBtn.textContent = "⏳ Loading...";
        refreshBtn.disabled = true;
        await this.fetchRecipeInspiration();
        this.render();
      });
    }
  }

  async init() {
    await this.fetchRecipeInspiration();
    this.render();
  }
}

export { InspirationView };
