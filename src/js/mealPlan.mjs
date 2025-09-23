// Utility function to create elements with classes and content
function createElement(tag, className = "", textContent = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

// Utility function to create buttons with event handlers
function createButton(text, className, onClick) {
  const button = createElement("button", className, text);
  if (onClick) button.addEventListener("click", onClick);
  return button;
}

// Create Meal Plan View with Row Layout
function createMealPlan(
  mealPlan,
  removeMealFromPlan,
  handleAddMeal,
  viewRecipeDetails
) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const mealTypes = [
    { key: "breakfast", label: "Breakfast" },
    { key: "lunch", label: "Lunch" },
    { key: "dinner", label: "Dinner" },
    { key: "snack", label: "Snack" },
  ];

  // Create main container
  const container = createElement("div", "meal-plan");

  // Create header
  const header = createElement("div", "meal-plan-header");
  const title = createElement("h2", "title", "Weekly Meal Plan");
  header.appendChild(title);
  container.appendChild(header);

  // Create the main grid container
  const grid = createElement("div", "grid");

  // Add empty cell for top-left corner
  const emptyCell = createElement("div");
  grid.appendChild(emptyCell);

  // Add day headers
  days.forEach((day) => {
    const dayHeader = createElement("div", "day-header", day);
    grid.appendChild(dayHeader);
  });

  // Add each meal type as a row
  mealTypes.forEach((mealType) => {
    // Add meal type label
    const mealLabel = createElement("div", "meal-type-label", mealType.label);
    grid.appendChild(mealLabel);

    // Add meal slots for each day
    days.forEach((day) => {
      const meal = mealPlan[day]?.[mealType.key];
      const mealSlot = createMealSlot(
        mealType.key,
        day,
        meal,
        removeMealFromPlan,
        handleAddMeal,
        viewRecipeDetails
      );
      grid.appendChild(mealSlot);
    });
  });

  container.appendChild(grid);
  return container;
}

// Create individual meal slot
function createMealSlot(
  mealTypeKey,
  day,
  meal,
  removeMealFromPlan,
  handleAddMeal,
  viewRecipeDetails
) {
  if (meal) {
    // Meal exists - show meal card
    const slot = createElement("div", `meal-slot ${mealTypeKey} filled`);

    // Meal image
    const image = document.createElement("img");
    image.src = meal.image;
    image.alt = meal.title;
    image.className = "meal-image";
    slot.appendChild(image);

    // Meal title
    const title = createElement("div", "meal-title", meal.title);
    slot.appendChild(title);

    // Action buttons
    const actions = createElement("div", "meal-actions");

    const viewBtn = createButton("View", "meal-action-btn view-btn", () =>
      viewRecipeDetails(meal)
    );
    const removeBtn = createButton("Remove", "meal-action-btn remove-btn", () =>
      removeMealFromPlan(day, mealTypeKey)
    );

    actions.appendChild(viewBtn);
    actions.appendChild(removeBtn);
    slot.appendChild(actions);

    return slot;
  } else {
    // Empty slot - show add button
    const slot = createElement("div", `meal-slot ${mealTypeKey}`);
    const addText = createElement(
      "div",
      "add-meal-text",
      `+ Add ${mealTypeKey.charAt(0).toUpperCase() + mealTypeKey.slice(1)}`
    );
    slot.appendChild(addText);

    slot.addEventListener("click", () => handleAddMeal(day, mealTypeKey));

    return slot;
  }
}

// Export the function
export { createMealPlan };
