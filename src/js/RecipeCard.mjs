import { storage, toast, showRecipeDetailsModal } from "./utils.js";

/**
 * RecipeCard Module
 * Creates reusable recipe card components with configurable actions
 *
 * Usage:
 *   const card = RecipeCard.create(recipe, {
 *     showAddToPlan: true,
 *     showFavorite: true,
 *     showRemove: false,
 *     onAddToPlan: (recipe) => { ... },
 *     favorites: []
 *   });
 */
export const RecipeCard = {
  /**
   * Create a tag element for dietary info, dish types, or cuisines
   * @param {string} text - The tag text to display
   * @returns {HTMLElement} - Span element with tag styling
   */
  createTag(text) {
    const span = document.createElement("span");
    span.className = "tag muted";
    span.textContent = text;
    return span;
  },

  /**
   * Create a recipe card with specified actions
   * @param {Object} recipe - Recipe object from Spoonacular API
   * @param {Object} options - Configuration options
   * @param {boolean} options.showAddToPlan - Show "Add to Plan" button
   * @param {boolean} options.showFavorite - Show favorite toggle button
   * @param {boolean} options.showRemove - Show remove button
   * @param {Function} options.onAddToPlan - Callback when "Add to Plan" clicked
   * @param {Function} options.onRemove - Callback when "Remove" clicked
   * @param {Array} options.favorites - Array of favorite recipes for toggle state
   * @returns {HTMLElement} - Article element containing the recipe card
   */
  create(recipe, options = {}) {
    const {
      showAddToPlan = false,
      showFavorite = false,
      showRemove = false,
      onAddToPlan = null,
      onRemove = null,
      favorites = [],
    } = options;

    const article = document.createElement("article");
    article.className = "recipe-card";

    // Image section
    const imgWrap = document.createElement("div");
    imgWrap.className = "recipe-image-wrap";
    const img = document.createElement("img");
    img.src = recipe.image;
    img.alt = recipe.title;
    img.className = "recipe-image";
    imgWrap.appendChild(img);

    // Body section
    const body = document.createElement("div");
    body.className = "recipe-body";

    // Header with title
    const header = document.createElement("div");
    header.className = "recipe-header";
    const title = document.createElement("h3");
    title.className = "meal-title";
    title.textContent = recipe.title;
    header.appendChild(title);

    // Meta info (time and servings)
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

    // Actions section
    const actions = document.createElement("div");
    actions.className = "recipe-actions";

    // View Recipe button (always shown)
    const viewBtn = document.createElement("button");
    viewBtn.className = "btn btn-light";
    viewBtn.textContent = "View Recipe";
    viewBtn.addEventListener("click", () => showRecipeDetailsModal(recipe));
    actions.appendChild(viewBtn);

    // Add to Plan button (optional)
    if (showAddToPlan && onAddToPlan) {
      const addBtn = document.createElement("button");
      addBtn.className = "btn btn-primary";
      addBtn.textContent = "Add to Plan";
      addBtn.addEventListener("click", () => onAddToPlan(recipe));
      actions.appendChild(addBtn);
    }

    // Favorite toggle button (optional)
    if (showFavorite) {
      const favBtn = this.createFavoriteButton(recipe, favorites);
      actions.appendChild(favBtn);
    }

    // Remove button (optional)
    if (showRemove && onRemove) {
      const removeBtn = document.createElement("button");
      removeBtn.className = "btn btn-danger";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => onRemove(recipe.id));
      actions.appendChild(removeBtn);
    }

    // Assemble the card
    body.appendChild(header);
    body.appendChild(meta);
    body.appendChild(tagsRow);
    body.appendChild(actions);

    article.appendChild(imgWrap);
    article.appendChild(body);

    return article;
  },

  /**
   * Create a favorite toggle button with state management
   * @param {Object} recipe - Recipe object
   * @param {Array} favorites - Array of favorite recipes
   * @returns {HTMLElement} - Button element with favorite toggle
   */
  createFavoriteButton(recipe, favorites) {
    const favBtn = document.createElement("button");
    const isFavorite = favorites.some(
      (fav) =>
        fav && typeof fav === "object" && "id" in fav && fav.id === recipe.id
    );

    // Set initial state
    favBtn.className =
      "favorite-btn " + (isFavorite ? "favorite-active" : "favorite-inactive");
    favBtn.setAttribute(
      "aria-label",
      isFavorite ? "Remove from favorites" : "Add to favorites"
    );
    favBtn.innerHTML = isFavorite ? "♥ Favorites" : "♡ Favorite";

    // Toggle favorite on click
    favBtn.addEventListener("click", () => {
      let currentFavorites = storage.getFavorites() || [];
      const isCurrentlyFavorite = currentFavorites.some(
        (fav) => fav.id === recipe.id
      );

      if (isCurrentlyFavorite) {
        // Remove from favorites
        currentFavorites = currentFavorites.filter(
          (fav) => fav.id !== recipe.id
        );
        favBtn.className = "favorite-btn favorite-inactive";
        favBtn.setAttribute("aria-label", "Add to favorites");
        favBtn.innerHTML = "♡ Favorite";
        toast.info(`Removed ${recipe.title} from favorites`);
      } else {
        // Add to favorites
        currentFavorites.push(recipe);
        favBtn.className = "favorite-btn favorite-active";
        favBtn.setAttribute("aria-label", "Remove from favorites");
        favBtn.innerHTML = "♥ Favorites";
        toast.success(`Added ${recipe.title} to favorites`);
      }

      storage.setFavorites(currentFavorites);
    });

    return favBtn;
  },
};

export default RecipeCard;
