// Utility function to create elements with classes and content
function createElement(tag, className = '', textContent = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

// Utility function to create buttons with event handlers
function createButton(text, className, onClick) {
  const button = createElement('button', className, text);
  if (onClick) button.addEventListener('click', onClick);
  return button;
}

// Create Meal Plan View
function createMealPlan(mealPlan, removeMealFromPlan, handleAddMeal, viewRecipeDetails) {
  const days = [
    "Monday",
    "Tuesday", 
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

  // Create main container
  const container = createElement('div', 'space-y-6');
  
  // Create title
  const title = createElement('h2', 'text-2xl font-bold text-gray-900', 'Weekly Meal Plan');
  container.appendChild(title);
  
  // Create days grid container
  const daysGrid = createElement('div', 'grid gap-6');
  
  // Create each day
  days.forEach(day => {
    const dayContainer = createElement('div', 'bg-white rounded-lg shadow-md p-6');
    
    // Day title
    const dayTitle = createElement('h3', 'text-xl font-semibold mb-4', day);
    dayContainer.appendChild(dayTitle);
    
    // Meals grid for this day
    const mealsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4');
    
    // Create each meal type slot
    mealTypes.forEach(mealType => {
      const meal = mealPlan[day]?.[mealType.toLowerCase()];
      const mealSlot = createElement('div', 'border border-gray-200 rounded-lg p-4');
      
      // Meal type header
      const mealTypeHeader = createElement('h4', 'font-medium text-gray-700 mb-2', mealType);
      mealSlot.appendChild(mealTypeHeader);
      
      if (meal) {
        // Create meal content container
        const mealContent = createElement('div', 'space-y-2');
        
        // Meal image
        const mealImage = document.createElement('img');
        mealImage.src = meal.image;
        mealImage.alt = meal.title;
        mealImage.className = 'w-full h-24 object-cover rounded';
        mealContent.appendChild(mealImage);
        
        // Meal title
        const mealTitle = createElement('p', 'text-sm font-medium', meal.title);
        mealContent.appendChild(mealTitle);
        
        // Buttons container
        const buttonsContainer = createElement('div', 'flex gap-1');
        
        // View button
        const viewButton = createButton(
          'View',
          'text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded',
          () => viewRecipeDetails(meal)
        );
        buttonsContainer.appendChild(viewButton);
        
        // Remove button
        const removeButton = createButton(
          'Remove',
          'text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded',
          () => removeMealFromPlan(day, mealType.toLowerCase())
        );
        buttonsContainer.appendChild(removeButton);
        
        mealContent.appendChild(buttonsContainer);
        mealSlot.appendChild(mealContent);
      } else {
        // Create "Add Meal" button
        const addMealButton = createButton(
          '+ Add Meal',
          'w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600',
          () => handleAddMeal(day, mealType.toLowerCase())
        );
        mealSlot.appendChild(addMealButton);
      }
      
      mealsGrid.appendChild(mealSlot);
    });
    
    dayContainer.appendChild(mealsGrid);
    daysGrid.appendChild(dayContainer);
  });
  
  container.appendChild(daysGrid);
  return container;
}

// Export the function
export { createMealPlan };
