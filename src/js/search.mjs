import { showModal, showRecipeDetailsModal, storage } from "./utils.js";
import { getAllRecipes } from "./recipeService.js";
export class SearchView {
  constructor(
    containerId = "main",
    recipes = getAllRecipes(),
    handlers = {},
    favorites = []
  ) {
    this.container = document.getElementById(containerId);
    this.recipes = recipes[0].recipes; // Fixed: don't take [0], use the full array
    this.handlers = handlers;
    this.favoritesArr = Array.isArray(favorites) ? favorites : [];
    this.urlFilters = this.getUrlFilters();
  }

  getUrlFilters() {
    const params = new URLSearchParams(window.location.search);
    return {
      type: params.get("type") || "",
      query: params.get("q") || "",
      day: params.get("day") || "", // NEW
      meal: params.get("meal") || "", // NEW
    };
  }

  showRecipeDetailsModal(recipe) {
    showRecipeDetailsModal(recipe);
  }

  createTag(text) {
    const span = document.createElement("span");
    span.className = "tag muted";
    span.textContent = text;
    return span;
  }

  createRecipeCard(recipe) {
    const article = document.createElement("article");
    article.className = "recipe-card";

    const imgWrap = document.createElement("div");
    imgWrap.className = "recipe-image-wrap";
    const img = document.createElement("img");
    img.src = recipe.image;
    img.alt = recipe.title;
    img.className = "recipe-image";
    imgWrap.appendChild(img);

    const body = document.createElement("div");
    body.className = "recipe-body";

    const header = document.createElement("div");
    header.className = "recipe-header";
    const title = document.createElement("h3");
    title.className = "meal-title";
    title.textContent = recipe.title;
    header.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "recipe-meta";
    meta.innerHTML = `
      <span class="muted">${recipe.readyInMinutes}m</span>
      &nbsp;•&nbsp;
      <span class="muted">${recipe.servings}p</span>
    `;

    const tagsRow = document.createElement("div");
    tagsRow.className = "recipe-tags";
    // Spoonacular: use diets, dishTypes, cuisines as tags
    const tags = [
      ...(recipe.diets || []),
      ...(recipe.dishTypes || []),
      ...(recipe.cuisines || []),
    ];
    tags.forEach((t) => {
      tagsRow.appendChild(this.createTag(t));
    });

    const actions = document.createElement("div");
    actions.className = "recipe-actions";

    const viewBtn = document.createElement("button");
    viewBtn.className = "nav-btn";
    viewBtn.textContent = "View Recipe";
    viewBtn.addEventListener("click", () =>
      this.showRecipeDetailsModal(recipe)
    );

    const addBtn = document.createElement("button");
    addBtn.className = "nav-btn primary";
    addBtn.textContent = "Add to Plan";
    addBtn.addEventListener("click", () => this.showAddToPlanModal(recipe));

    const favBtn = document.createElement("button");
    const isFavorite = this.favoritesArr.some(
      (fav) =>
        fav && typeof fav === "object" && "id" in fav && fav.id === recipe.id
    );
    favBtn.className =
      "favorite-btn " + (isFavorite ? "favorite-active" : "favorite-inactive");
    favBtn.setAttribute(
      "aria-label",
      isFavorite ? "Remove from favorites" : "Add to favorites"
    );
    favBtn.innerHTML = isFavorite ? "♥ Favorites" : "♡ Favorite";
    favBtn.addEventListener("click", () => {
      let favorites = storage.getFavorites() || [];
      if (favorites.some((fav) => fav.id === recipe.id)) {
        favorites = favorites.filter((fav) => fav.id !== recipe.id);
        favBtn.className = "favorite-btn favorite-inactive";
        favBtn.setAttribute("aria-label", "Add to favorites");
        favBtn.innerHTML = "♡ Favorite";
        if (window.toast && typeof window.toast.info === "function") {
          window.toast.info(`Removed ${recipe.title} from favorites`);
        }
      } else {
        favorites.push(recipe);
        favBtn.className = "favorite-btn favorite-active";
        favBtn.setAttribute("aria-label", "Remove from favorites");
        favBtn.innerHTML = "♥ Favorites";
        if (window.toast && typeof window.toast.success === "function") {
          window.toast.success(`Added ${recipe.title} to favorites`);
        }
      }
      storage.setFavorites(favorites);
      this.favoritesArr = favorites;
      this.handlers.onToggleFavorite(recipe);
    });

    actions.appendChild(viewBtn);
    actions.appendChild(addBtn);
    actions.appendChild(favBtn);

    body.appendChild(header);
    body.appendChild(meta);
    body.appendChild(tagsRow);
    body.appendChild(actions);

    article.appendChild(imgWrap);
    article.appendChild(body);

    return article;
  }

  showAddToPlanModal(recipe) {
    const { day, meal } = this.urlFilters; // Get from URL

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
          alert("Please select both day and meal type.");
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
          alert(`Added ${recipe.title} to ${day} ${mealType}`);
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

    const filterBtn = document.createElement("button");
    filterBtn.className = "nav-btn";
    filterBtn.textContent = "Filters";

    header.appendChild(title);
    header.appendChild(searchInput);
    header.appendChild(filterBtn);

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
