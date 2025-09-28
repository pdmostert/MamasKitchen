import { showModal, showRecipeDetailsModal } from "./utils.js";
import { getAllRecipes } from "./recipeService.js";
export class SearchView {
  constructor(
    containerId = "main",
    recipes = getAllRecipes(),
    handlers = {},
    favorites = []
  ) {
    this.container = document.getElementById(containerId);
    this.recipes = recipes[0];
    this.handlers = handlers;
    this.favoritesSet = new Set(favorites);
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
    favBtn.className =
      "favorite-btn " +
      (this.favoritesSet.has(recipe.id)
        ? "favorite-active"
        : "favorite-inactive");
    favBtn.setAttribute(
      "aria-label",
      this.favoritesSet.has(recipe.id)
        ? "Remove from favorites"
        : "Add to favorites"
    );
    favBtn.innerHTML = this.favoritesSet.has(recipe.id)
      ? "♥ Favorites"
      : "♡ Favorite";
    favBtn.addEventListener("click", () => {
      if (this.favoritesSet.has(recipe.id)) {
        this.favoritesSet.delete(recipe.id);
        favBtn.className = "favorite-btn favorite-inactive";
        favBtn.setAttribute("aria-label", "Add to favorites");
        favBtn.innerHTML = "♡ Favorite";
        if (window.toast && typeof window.toast.info === "function") {
          window.toast.info(`Removed ${recipe.title} from favorites`);
        }
      } else {
        this.favoritesSet.add(recipe.id);
        favBtn.className = "favorite-btn favorite-active";
        favBtn.setAttribute("aria-label", "Remove from favorites");
        favBtn.innerHTML = "♥ Favorites";
        if (window.toast && typeof window.toast.success === "function") {
          window.toast.success(`Added ${recipe.title} to favorites`);
        }
      }
      // Persist favorites to localStorage
      localStorage.setItem(
        "mealPlannerFavorites",
        JSON.stringify(Array.from(this.favoritesSet))
      );
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
    // Build modal content as HTML string
    const formHtml = `
      <div class="modal-recipe-info"><strong>Recipe</strong><br>${recipe.title}</div>
      <label class="modal-label" for="modal-day-select">Day</label>
      <select id="modal-day-select" class="modal-select">
        <option value="">Select a day</option>
        ${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => `<option value='${d}'>${d}</option>`).join("")}
      </select>
      <label class="modal-label" for="modal-mealtype-select">Meal Type</label>
      <select id="modal-mealtype-select" class="modal-select">
        <option value="">Select meal type</option>
        ${["breakfast", "lunch", "dinner", "snack"].map((t) => `<option value='${t}'>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join("")}
      </select>
      <div class="modal-btn-row"></div>
    `;
    showModal({
      title: "Add to Meal Plan",
      content: formHtml,
      onClose: null,
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
    this.container.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "recipes-grid";
    // Spoonacular: recipes may be nested under .recipes
    const recipeList = Array.isArray(recipes) ? recipes : recipes.recipes || [];
    recipeList.forEach((r) => {
      const card = this.createRecipeCard(r);
      grid.appendChild(card);
    });
    this.container.appendChild(grid);
  }

  filterRecipes(query) {
    const q = (query || "").toLowerCase().trim();
    return this.recipes.filter((r) => {
      if (!q) return true;
      if (r.title.toLowerCase().includes(q)) return true;
      if ((r.tags || []).some((t) => t.toLowerCase().includes(q))) return true;
      if (
        (r.ingredients || []).some((ing) => ing.name.toLowerCase().includes(q))
      )
        return true;
      return false;
    });
  }

  renderSearchHeader() {
    const header = document.createElement("div");
    header.className = "search-header";

    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.placeholder = "Search recipes, ingredients, or tags...";
    searchInput.className = "search-input";

    const filterBtn = document.createElement("button");
    filterBtn.className = "nav-btn";
    filterBtn.textContent = "Filters";

    header.appendChild(searchInput);
    header.appendChild(filterBtn);

    searchInput.addEventListener("input", () => {
      const filtered = this.filterRecipes(searchInput.value);
      this.renderList(filtered);
    });

    return header;
  }

  render() {
    this.container.innerHTML = "";
    const header = this.renderSearchHeader();
    this.container.appendChild(header);
    this.renderList(this.recipes);
  }

  updateFavorites(newFavs) {
    this.favoritesSet = new Set(newFavs || []);
    this.renderList(this.recipes);
  }
}
