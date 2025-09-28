import { storage, toast, showRecipeDetailsModal } from "./utils.js";

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

  createMealPlan() {
    // Create main container
    const container = this.createElement("div", "meal-plan");

    // Create header
    const header = this.createElement("div", "meal-plan-header");
    const title = this.createElement("h2", "title", "Weekly Meal Plan");
    header.appendChild(title);
    container.appendChild(header);

    // Create the main grid container
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

    container.appendChild(grid);
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
        "meal-action-btn view-btn",
        () => this.viewRecipeDetails(meal)
      );
      const removeBtn = this.createButton(
        "Remove",
        "meal-action-btn remove-btn",
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
    toast.info(`Add meal clicked: ${mealType} for ${day}`);
    // You can implement modal or selection logic here
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
    showRecipeDetailsModal(recipe);
  }

  render() {
    this.container.innerHTML = "";
    const mealPlanEl = this.createMealPlan();
    this.container.appendChild(mealPlanEl);
  }

  init() {
    this.render();
  }
}

export { MealPlan };
