import { storage, toast, showRecipeDetailsModal } from "./utils.js";

/**
 * MealPlan class - Manages and displays the weekly meal planner
 *
 * This class handles the display and interaction with the weekly meal plan.
 * It supports two layout modes:
 * - Desktop: Traditional grid with days as columns and meal types as rows
 * - Mobile: Stacked cards grouped by day for better mobile usability
 *
 * Features:
 * - Add meals by clicking empty slots (redirects to search with filters)
 * - View recipe details
 * - Remove meals from the plan
 * - Automatically switches layout based on screen size
 * - Persists data to localStorage
 */
export default class MealPlan {
  constructor(containerId = "app") {
    this.data = {
      mealPlan: storage.getMealPlan() || {},
      favorites: storage.getFavorites() || [],
    };
    this.container = document.getElementById(containerId);
    this.days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    this.mealTypes = [
      { key: "breakfast", label: "Breakfast" },
      { key: "lunch", label: "Lunch" },
      { key: "dinner", label: "Dinner" },
      { key: "snack", label: "Snack" },
    ];
  }

  createElement(tag, className = "", textContent = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
  }

  createButton(text, className, onClick) {
    const button = this.createElement("button", className, text);
    if (onClick) button.addEventListener("click", onClick);
    return button;
  }

  /**
   * Create the meal plan grid
   * On mobile (< 768px), renders as stacked day sections
   * On desktop, renders as traditional grid with days as columns
   */
  createMealPlan() {
    // Create main container
    const container = this.createElement("div", "meal-plan");

    // Create header
    const header = this.createElement("div", "meal-plan-header");
    const title = this.createElement("h2", "title", "Weekly Meal Plan");
    header.appendChild(title);
    container.appendChild(header);

    // Check if mobile view
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Mobile layout: stack by day
      const mobileContainer = this.createMobileMealPlan();
      container.appendChild(mobileContainer);
    } else {
      // Desktop layout: traditional grid
      const grid = this.createDesktopMealPlan();
      container.appendChild(grid);
    }

    return container;
  }

  /**
   * Create desktop grid layout (original layout)
   */
  createDesktopMealPlan() {
    const grid = this.createElement("div", "grid");

    // Add empty cell for top-left corner
    const emptyCell = this.createElement("div");
    grid.appendChild(emptyCell);

    // Add day headers
    this.days.forEach((day) => {
      const dayHeader = this.createElement("div", "day-header", day);
      grid.appendChild(dayHeader);
    });

    // Add each meal type as a row
    this.mealTypes.forEach((mealType) => {
      // Add meal type label
      const mealLabel = this.createElement(
        "div",
        "meal-type-label",
        mealType.label
      );
      grid.appendChild(mealLabel);

      // Add meal slots for each day
      this.days.forEach((day) => {
        const meal = this.data.mealPlan[day]?.[mealType.key];
        const mealSlot = this.createMealSlot(mealType.key, day, meal);
        grid.appendChild(mealSlot);
      });
    });

    return grid;
  }

  /**
   * Create mobile stacked layout (grouped by day)
   */
  createMobileMealPlan() {
    const container = this.createElement("div", "grid");

    this.days.forEach((day) => {
      // Create day section
      const daySection = this.createElement("div", "mobile-day-section");

      // Day header
      const dayHeader = this.createElement("div", "mobile-day-header", day);
      daySection.appendChild(dayHeader);

      // Add each meal type for this day
      this.mealTypes.forEach((mealType) => {
        const mealGroup = this.createElement("div", "mobile-meal-group");

        // Meal type label
        const mealTypeLabel = this.createElement(
          "div",
          "mobile-meal-type",
          mealType.label
        );
        mealGroup.appendChild(mealTypeLabel);

        // Meal slot
        const meal = this.data.mealPlan[day]?.[mealType.key];
        const mealSlot = this.createMealSlot(mealType.key, day, meal);
        mealGroup.appendChild(mealSlot);

        daySection.appendChild(mealGroup);
      });

      container.appendChild(daySection);
    });

    return container;
  }

  createMealSlot(mealTypeKey, day, meal) {
    if (meal) {
      // Meal exists - show meal card
      const slot = this.createElement("div", `meal-slot ${mealTypeKey} filled`);

      // Meal image
      const image = document.createElement("img");
      image.src = meal.image;
      image.alt = meal.title;
      image.className = "meal-image";
      slot.appendChild(image);

      // Meal title
      const title = this.createElement("div", "meal-title", meal.title);
      slot.appendChild(title);

      // Action buttons
      const actions = this.createElement("div", "meal-actions");

      const viewBtn = this.createButton(
        "View",
        "btn btn-light btn-sm meal-action-btn view-btn",
        () => this.viewRecipeDetails(meal)
      );
      const removeBtn = this.createButton(
        "Remove",
        "btn btn-danger btn-sm meal-action-btn remove-btn",
        () => this.removeMealFromPlan(day, mealTypeKey)
      );

      actions.appendChild(viewBtn);
      actions.appendChild(removeBtn);
      slot.appendChild(actions);

      return slot;
    } else {
      // Empty slot - show add button
      const slot = this.createElement("div", `meal-slot ${mealTypeKey}`);
      const addText = this.createElement(
        "div",
        "add-meal-text",
        `+ Add ${mealTypeKey.charAt(0).toUpperCase() + mealTypeKey.slice(1)}`
      );
      slot.appendChild(addText);

      slot.addEventListener("click", () =>
        this.handleAddMeal(day, mealTypeKey)
      );

      return slot;
    }
  }

  handleAddMeal(day, mealType) {
    const searchUrl = `/search/?type=${this.getMealTypeFilter(mealType)}&day=${day}&meal=${mealType}`;
    window.location.href = searchUrl;
  }

  getMealTypeFilter(mealType) {
    const typeMap = {
      breakfast: "breakfast",
      lunch: "main course",
      dinner: "main course",
      snack: "snack",
    };
    return typeMap[mealType] || "main course";
  }

  removeMealFromPlan(day, mealType) {
    if (this.data.mealPlan[day] && this.data.mealPlan[day][mealType]) {
      const meal = this.data.mealPlan[day][mealType];
      delete this.data.mealPlan[day][mealType];
      if (Object.keys(this.data.mealPlan[day]).length === 0)
        delete this.data.mealPlan[day];
      storage.setMealPlan(this.data.mealPlan);
      this.render();
      toast.success(`Removed ${meal.title} from meal plan`);
    }
  }

  viewRecipeDetails(recipe) {
    // Adapt recipe for modal: Spoonacular fields
    const tags = [
      ...(recipe.dishTypes || []),
      ...(recipe.diets || []),
      ...(recipe.cuisines || []),
    ];
    const ingredients = (recipe.extendedIngredients || []).map((ing) => ({
      name: ing.nameClean || ing.name || ing.original,
      amount: ing.amount ? `${ing.amount} ${ing.unit}` : undefined,
    }));
    showRecipeDetailsModal({
      ...recipe,
      cookTime: recipe.readyInMinutes,
      tags,
      ingredients,
      instructions:
        recipe.instructions ||
        recipe.analyzedInstructions?.[0]?.steps?.map((s) => s.step).join(" ") ||
        "",
    });
  }

  render() {
    this.container.innerHTML = "";
    const mealPlanEl = this.createMealPlan();
    this.container.appendChild(mealPlanEl);
  }

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
}

export { MealPlan };
