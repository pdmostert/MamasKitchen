import { storage, loadHeaderFooter } from "./utils.js";

export default class ShoppingView {
  constructor(containerId = "main") {
    this.container = document.getElementById(containerId);
    this.mealPlan = storage.getMealPlan() || {};
    this.shoppingList = {};
  }

  // Extract all ingredients from the meal plan
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

  // Group ingredients by aisle and combine similar items
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

  // Create HTML for a single ingredient
  createIngredientItem(ingredient, index, aisle) {
    const li = document.createElement("li");
    li.className = "ingredient-item";
    li.style.cssText = "padding: 0.75rem; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; gap: 0.75rem;";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `ingredient-${aisle}-${index}`;
    checkbox.style.cssText = "width: 18px; height: 18px; cursor: pointer;";
    checkbox.addEventListener("change", (e) => {
      if (e.target.checked) {
        label.style.textDecoration = "line-through";
        label.style.color = "#9ca3af";
      } else {
        label.style.textDecoration = "none";
        label.style.color = "#374151";
      }
    });

    const label = document.createElement("label");
    label.htmlFor = `ingredient-${aisle}-${index}`;
    label.style.cssText = "cursor: pointer; flex: 1;";

    const amountText = ingredient.amount
      ? `${ingredient.amount.toFixed(1)} ${ingredient.unit} `
      : "";
    label.textContent = `${amountText}${ingredient.name}`;

    li.appendChild(checkbox);
    li.appendChild(label);

    return li;
  }

  // Create HTML for an aisle section
  createAisleSection(aisle, ingredients) {
    const section = document.createElement("div");
    section.className = "aisle-section";
    section.style.cssText = "margin-bottom: 2rem; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);";

    const header = document.createElement("div");
    header.className = "aisle-header";
    header.style.cssText = "background: #f3f4f6; padding: 1rem 1.25rem; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;";
    header.textContent = `📦 ${aisle} (${ingredients.length})`;

    const list = document.createElement("ul");
    list.style.cssText = "list-style: none; padding: 0; margin: 0;";

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
    main.className = "page-main";
    main.style.cssText = "max-width: 800px; margin: 0 auto; padding: 2rem 1rem;";

    const title = document.createElement("h2");
    title.className = "page-title";
    title.textContent = "🛒 Shopping List";
    main.appendChild(title);

    // Extract and group ingredients
    const allIngredients = this.extractIngredients();

    if (allIngredients.length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.style.cssText = "text-align: center; color: #6b7280; margin-top: 2rem;";
      empty.textContent = "Your shopping list is empty. Add meals to your meal plan to generate a shopping list.";
      main.appendChild(empty);
      this.container.appendChild(main);
      return;
    }

    const groupedByAisle = this.groupByAisle(allIngredients);

    // Create header with total count
    const subtitle = document.createElement("p");
    subtitle.className = "subtitle";
    subtitle.style.cssText = "color: #6b7280; margin-bottom: 2rem; text-align: center;";
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