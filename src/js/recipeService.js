
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";



async function searchSpoonacularRecipes(query, options = {}) {
  if (!SPOONACULAR_API_KEY) {
    console.error("Spoonacular API key not configured");
    return [];
  }

  const params = new URLSearchParams({
    apiKey: SPOONACULAR_API_KEY,
    query: query,
    number: options.number || 10,
    addRecipeInformation: true,
    fillIngredients: true,
    ...(options.diet && { diet: options.diet }),
    ...(options.cuisine && { cuisine: options.cuisine }),
  });

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/complexSearch?${params}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching from Spoonacular:", error);
    return [];
  }
}


async function getRandomSpoonacularRecipes(count = 10) {
  if (!SPOONACULAR_API_KEY) {
    console.error("Spoonacular API key not configured");
    return [];
  }

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/random?apiKey=${SPOONACULAR_API_KEY}&number=${count}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.recipes || [];
  } catch (error) {
    console.error("Error fetching random recipes:", error);
    return [];
  }
}


async function getSpoonacularRecipeDetails(id) {
  if (!SPOONACULAR_API_KEY) {
    console.error("Spoonacular API key not configured");
    return null;
  }

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    return null;
  }
}



export function getAllRecipes() {
  return getRandomSpoonacularRecipes(20);
}


export async function searchRecipes(query, options = {}) {

  return searchSpoonacularRecipes(query, options);
}


export async function getRecipeById(id) {
  return getSpoonacularRecipeDetails(id);
}


export async function getRandomRecipes(count = 20) {
  return getRandomSpoonacularRecipes(count);
}



