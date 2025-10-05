import { storage, loadHeaderFooter, showModal, toast } from "./utils.js";
import RecipeCard from "./RecipeCard.mjs";

export default class FavoritesView {
  constructor(containerId = "main") {
    this.container = document.getElementById(containerId);
    this.favoriteRecipes = storage.getFavorites() || [];
  }

  /**
   * Create a recipe card with favorite-specific actions
   * Includes "Add to Plan" and "Remove" buttons
   */
  createRecipeCard(recipe) {
    return RecipeCard.create(recipe, {
      showAddToPlan: true,
      showFavorite: false,
      showRemove: true,
      onAddToPlan: (recipe) => this.showAddToPlanModal(recipe),
      onRemove: (id) => this.removeFavorite(id),
      favorites: this.favoriteRecipes,
    });
  }

  /**
   * Show modal to add recipe to meal plan
   * Same functionality as SearchView
   */
  showAddToPlanModal(recipe) {
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
        .map((d) => `<option value='${d}'>${d}</option>`)
        .join("")}
    </select>
    <label class="modal-label" for="modal-mealtype-select">Meal Type</label>
    <select id="modal-mealtype-select" class="modal-select">
      <option value="">Select meal type</option>
      ${["breakfast", "lunch", "dinner", "snack"]
        .map(
          (t) =>
            `<option value='${t}'>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`
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
        toast.success(`Added ${recipe.title} to ${day} ${mealType}`);
      };
      const btnRow = document.querySelector("#global-modal .modal-btn-row");
      btnRow.appendChild(addBtn);
    }, 0);
  }

  /**
   * Remove a recipe from favorites
   * @param {number} id - Recipe ID to remove
   */
  removeFavorite(id) {
    this.favoriteRecipes = this.favoriteRecipes.filter(
      (r) => String(r.id) !== String(id)
    );
    storage.setFavorites(this.favoriteRecipes);
    this.render();
  }

  async render() {
    await loadHeaderFooter();
    // Re-select container in case header/footer replaced it
    this.container = document.getElementById("main");
    if (!this.container) {
      // console.error(
      //   "FavoritesView: #main container not found after header/footer load. Check your HTML and templates."
      // );
      throw new Error(
        "FavoritesView: #main container not found after header/footer load."
      );
    }
    this.container.innerHTML = "";
    const title = document.createElement("h2");
    title.className = "page-title";
    title.textContent = "Favorite Recipes";
    this.container.appendChild(title);

    if (this.favoriteRecipes.length === 0) {
      const p = document.createElement("p");
      p.className = "muted";
      p.textContent = "You have no favorite recipes yet.";
      this.container.appendChild(p);
    } else {
      const grid = document.createElement("div");
      grid.className = "recipes-grid";
      this.favoriteRecipes.forEach((recipe) => {
        grid.appendChild(this.createRecipeCard(recipe));
      });
      this.container.appendChild(grid);
    }
  }
}
