import { showModal, storage, toast } from "./utils.js";
import { getAllRecipes } from "./recipeService.js";
import RecipeCard from "./RecipeCard.mjs";

/**
 * SearchView class - Displays searchable recipe results
 *
 * Handles recipe search, filtering, and displays recipe cards with actions.
 * Supports URL parameters for pre-filtering (useful when adding meals from meal planner).
 * Users can search by text, filter by type, add recipes to favorites, or add to meal plan.
 */
export class SearchView {
  constructor(
    containerId = "main",
    recipes = getAllRecipes(),
    handlers = {},
    favorites = []
  ) {
    this.container = document.getElementById(containerId);
    this.recipes = Array.isArray(recipes) ? recipes : [];
    this.handlers = handlers;
    this.favoritesArr = Array.isArray(favorites) ? favorites : [];
    this.urlFilters = this.getUrlFilters();
  }

  /**
   * Get filter parameters from URL query string
   * Used when navigating from meal planner to pre-select day/meal type
   * @returns {Object} - Object with type, query, day, and meal properties
   */
  getUrlFilters() {
    const params = new URLSearchParams(window.location.search);
    return {
      type: params.get("type") || "",
      query: params.get("q") || "",
      day: params.get("day") || "",
      meal: params.get("meal") || "",
    };
  }

  /**
   * Create a recipe card using the shared RecipeCard module
   * Configured for search view with "Add to Plan" and favorite buttons
   */
  createRecipeCard(recipe) {
    // Use the shared RecipeCard module with search-specific actions
    return RecipeCard.create(recipe, {
      showAddToPlan: true,
      showFavorite: true,
      showRemove: false,
      onAddToPlan: (recipe) => this.showAddToPlanModal(recipe),
      favorites: this.favoritesArr,
    });
  }

  /**
   * Show modal to add a recipe to the meal plan
   * Pre-selects day and meal type if provided via URL parameters
   * @param {Object} recipe - Recipe object to add to meal plan
   */
  showAddToPlanModal(recipe) {
    const { day, meal } = this.urlFilters; // Pre-select from URL if available

    const formHtml = `
    <div class="modal-recipe-info"><strong>Recipe</strong><br>${recipe.title}</div>
    <label class="modal-label" for="modal-day-select">Day</label>
    <select id="modal-day-select" class="modal-select">
      <option value="">Select a day</option>
      ${[
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]
        .map(
          (d) =>
            `<option value='${d}' ${d === day ? "selected" : ""}>${d}</option>`
        )
        .join("")}
    </select>
    <label class="modal-label" for="modal-mealtype-select">Meal Type</label>
    <select id="modal-mealtype-select" class="modal-select">
      <option value="">Select meal type</option>
      ${["breakfast", "lunch", "dinner", "snack"]
        .map(
          (t) =>
            `<option value='${t}' ${t === meal ? "selected" : ""}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`
        )
        .join("")}
    </select>
    <div class="modal-btn-row"></div>
  `;
    showModal({
      title: "Add to Meal Plan",
      content: formHtml,
      onClose: null,
      modalClass: "add-to-plan-modal",
    });
    // Attach event handler for Add to Plan button after modal is rendered
    setTimeout(() => {
      const addBtn = document.createElement("button");
      addBtn.className = "modal-btn modal-confirm";
      addBtn.textContent = "Add to Plan";
      addBtn.onclick = () => {
        const day = document.getElementById("modal-day-select").value;
        const mealType = document.getElementById("modal-mealtype-select").value;
        if (!day || !mealType) {
          toast.error("Please select both day and meal type.");
          return;
        }
        let mealPlan = {};
        try {
          mealPlan =
            JSON.parse(localStorage.getItem("mealPlannerMealPlan")) || {};
        } catch {
          mealPlan = {};
        }
        if (!mealPlan[day]) mealPlan[day] = {};
        mealPlan[day][mealType] = recipe;
        localStorage.setItem("mealPlannerMealPlan", JSON.stringify(mealPlan));
        document.getElementById("global-modal").remove();
        if (window.toast && typeof window.toast.success === "function") {
          window.toast.success(`Added ${recipe.title} to ${day} ${mealType}`);
        } else {
          toast.success(`Added ${recipe.title} to ${day} ${mealType}`);
        }
      };
      const btnRow = document.querySelector("#global-modal .modal-btn-row");
      btnRow.appendChild(addBtn);
    }, 0);
  }

  renderList(recipes) {
    // Find existing grid or create new one
    let grid = this.container.querySelector(".recipes-grid");
    if (!grid) {
      grid = document.createElement("div");
      grid.className = "recipes-grid";
      this.container.appendChild(grid);
    }

    // Clear only the grid content, not the whole container
    grid.innerHTML = "";

    // Spoonacular: recipes may be nested under .recipes
    const recipeList = Array.isArray(recipes) ? recipes : recipes.recipes || [];
    recipeList.forEach((r) => {
      const card = this.createRecipeCard(r);
      grid.appendChild(card);
    });
  }

  filterRecipes(query) {
    const q = (query || "").toLowerCase().trim();
    const typeFilter = this.urlFilters.type.toLowerCase();

    return this.recipes.filter((r) => {
      // Text search filter
      if (q) {
        const matchesText =
          r.title.toLowerCase().includes(q) ||
          (r.ingredients || []).some((ing) =>
            ing.name.toLowerCase().includes(q)
          ) ||
          (r.dishTypes || []).some((t) => t.toLowerCase().includes(q)) ||
          (r.cuisines || []).some((t) => t.toLowerCase().includes(q)) ||
          (r.diets || []).some((ing) => ing.toLowerCase().includes(q));

        if (!matchesText) return false;
      }

      // URL type filter (e.g., ?type=main course)
      if (typeFilter) {
        const dishTypes = (r.dishTypes || []).map((t) => t.toLowerCase());
        if (!dishTypes.some((type) => type.includes(typeFilter))) {
          return false;
        }
      }

      return true;
    });
  }

  renderSearchHeader() {
    const header = document.createElement("div");
    header.className = "search-header";

    const title = document.createElement("h2");
    title.className = "page-title";
    title.textContent = "Search Recipes";

    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.placeholder = "Search recipes, ingredients, or tags...";
    searchInput.className = "search-input";
    searchInput.id = "recipe-search-input";

    header.appendChild(title);
    header.appendChild(searchInput);

    searchInput.addEventListener("input", () => {
      const filtered = this.filterRecipes(searchInput.value);
      this.renderList(filtered);
    });

    return header;
  }

  render() {
    // Only clear if container is completely empty
    if (!this.container.querySelector(".search-header")) {
      this.container.innerHTML = "";

      // Add header first
      const header = this.renderSearchHeader();
      this.container.appendChild(header);

      // Show active filter info if type filter is applied
      if (this.urlFilters.type) {
        this.showActiveFilter();
      }
    }

    // Apply URL filters on initial load
    const searchInput = document.getElementById("recipe-search-input");
    if (searchInput && this.urlFilters.query) {
      searchInput.value = this.urlFilters.query;
    }

    // Render recipes
    const filtered = this.filterRecipes(this.urlFilters.query);
    this.renderList(filtered);
  }

  showActiveFilter() {
    const filterInfo = document.createElement("div");
    filterInfo.className = "active-filter-info";
    filterInfo.innerHTML = `
      <span>Filtered by: <strong>${this.urlFilters.type}</strong></span>
      <button onclick="window.location.href='${window.location.pathname}'" class="clear-filter-btn">Clear Filter</button>
    `;
    this.container.insertBefore(filterInfo, this.container.children[1]);
  }

  updateFavorites(newFavs) {
    this.favoritesArr = Array.isArray(newFavs) ? newFavs : [];
    this.renderList(this.recipes);
  }
}
