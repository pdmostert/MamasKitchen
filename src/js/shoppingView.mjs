import { storage, loadHeaderFooter } from "./utils.js";

/**
 * ShoppingView class - Displays a shopping list generated from the meal plan
 *
 * This view extracts all ingredients from the weekly meal plan,
 * groups them by store aisle (using Spoonacular's aisle data),
 * and combines duplicate ingredients with matching units.
 *
 * Features:
 * - Checkboxes to mark items as purchased
 * - Organized by aisle for easier shopping
 * - Combines same ingredients (e.g., "2 cups flour" + "1 cup flour" = "3 cups flour")
 */
export default class ShoppingView {
  constructor(containerId = "main") {
    this.container = document.getElementById(containerId);
    this.mealPlan = storage.getMealPlan() || {};
    this.shoppingList = {};
  }

  /**
   * Extract all ingredients from all meals in the meal plan
   * Loops through each day and each meal type to collect ingredients
   * @returns {Array} - Array of ingredient objects with name, amount, unit, aisle
   */
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
            ingredients.push({
              name:
                ingredient.nameClean || ingredient.name || ingredient.original,
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

  /**
   * Group ingredients by aisle and combine similar items
   *
   * This function organizes ingredients by their store aisle (Produce, Dairy, etc.)
   * and intelligently combines duplicate ingredients if they have the same unit.
   *
   * Example:
   * - "2 cups flour" + "1 cup flour" = "3 cups flour"
   * - "2 cups flour" + "100g flour" = both listed separately (different units)
   *
   * @param {Array} ingredients - Array of ingredient objects
   * @returns {Object} - Object with aisles as keys, arrays of ingredients as values
   */
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

  /**
   * Create HTML for a single ingredient item with checkbox
   * @param {Object} ingredient - Ingredient object with name, amount, unit
   * @param {number} index - Index for unique ID
   * @param {string} aisle - Aisle name for unique ID
   * @returns {HTMLElement} - List item element
   */
  createIngredientItem(ingredient, index, aisle) {
    const li = document.createElement("li");
    li.className = "ingredient-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "ingredient-checkbox";
    checkbox.id = `ingredient-${aisle}-${index}`;
    checkbox.addEventListener("change", (e) => {
      if (e.target.checked) {
        label.classList.add("checked");
      } else {
        label.classList.remove("checked");
      }
    });

    const label = document.createElement("label");
    label.htmlFor = `ingredient-${aisle}-${index}`;
    label.className = "ingredient-label";

    const amountText = ingredient.amount
      ? `${ingredient.amount.toFixed(1)} ${ingredient.unit} `
      : "";
    label.textContent = `${amountText}${ingredient.name}`;

    li.appendChild(checkbox);
    li.appendChild(label);

    return li;
  }

  /**
   * Create an aisle section with header and ingredient list
   * @param {string} aisle - Aisle name
   * @param {Array} ingredients - Array of ingredients for this aisle
   * @returns {HTMLElement} - Section element containing aisle and ingredients
   */
  createAisleSection(aisle, ingredients) {
    const section = document.createElement("div");
    section.className = "aisle-section";

    const header = document.createElement("div");
    header.className = "aisle-header";
    header.textContent = `📦 ${aisle} (${ingredients.length})`;

    const list = document.createElement("ul");
    list.className = "aisle-list";

    ingredients.forEach((ingredient, index) => {
      const item = this.createIngredientItem(ingredient, index, aisle);
      list.appendChild(item);
    });

    section.appendChild(header);
    section.appendChild(list);

    return section;
  }

  render() {
    this.container.innerHTML = "";

    const main = document.createElement("main");
    main.className = "shopping-page-main";

    const title = document.createElement("h2");
    title.className = "page-title";
    title.textContent = "🛒 Shopping List";
    main.appendChild(title);

    // Extract and group ingredients
    const allIngredients = this.extractIngredients();

    if (allIngredients.length === 0) {
      const empty = document.createElement("p");
      empty.className = "shopping-empty muted";
      empty.textContent =
        "Your shopping list is empty. Add meals to your meal plan to generate a shopping list.";
      main.appendChild(empty);
      this.container.appendChild(main);
      return;
    }

    const groupedByAisle = this.groupByAisle(allIngredients);

    // Create header with total count
    const subtitle = document.createElement("p");
    subtitle.className = "shopping-subtitle";
    subtitle.textContent = `${allIngredients.length} ingredients organized by store aisle`;
    main.appendChild(subtitle);

    // Sort aisles alphabetically
    const sortedAisles = Object.keys(groupedByAisle).sort();

    // Create aisle sections
    sortedAisles.forEach((aisle) => {
      const section = this.createAisleSection(aisle, groupedByAisle[aisle]);
      main.appendChild(section);
    });

    this.container.appendChild(main);
  }

  async init() {
    await loadHeaderFooter();
    // Re-select container after header/footer load
    this.container = document.getElementById("main");
    this.render();
  }
}

export { ShoppingView };
