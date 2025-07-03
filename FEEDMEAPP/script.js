// API credentials //
const API_ID = '03521114'; 
const API_KEY = 'b78d120616494dca7c991ec429d5411a'; 
const BASE_URL = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${'03521114'}&app_key=${'b78d120616494dca7c991ec429d5411a'}`;
// DOM //
const searchInput = document.querySelector('searchInput');
const searchButton = document.querySelector('searchButton');
const cuisineFilter = document.querySelector('cusineFilter');
const dietFilter = document.querySelector('dietFilter');
const healthFilter = document.querySelector('healthFilter');
const recipeCardsContainer= document.querySelector('recipeCardsContainer');
const darkModeToggle = document.querySelector('darkModeToggle');
const loadingIndicator = document.querySelector('loadingIndicator');
const searchSuggestionsContainer = document.querySelector('searchSuggestionsContaier');

// Navigation Elements //
const homeSection = document.querySelector('homeSection');
const favoritesSection = document.querySelector('favouritesSection');
const showHomeBtn = document.querySelector('showHomeBtn');
const showFavoritesBtn = document.querySelector('showFavouritesBtn');
const favoriteRecipesContainer = document.querySelector('favouritesRecipesContainer');

//Modal Elements //
const recipeModal = document.querySelector('recipieModal');
const closeModalBtn = document.querySelector('closeModalBtn');
const modalRecipeTitle = document.querySelector('modalRecipeTitle');
const modalRecipeImage = document.querySelector('modalRecipeImage');
const modalIngredientsList = document.querySelector('modalIngredientsList');
const modalCalories = document.querySelector('modalCalories');
const modalProtein = document.querySelector('modalProtein');
const modalFat = document.querySelector('modalFat');
const modalCarbs = document.querySelector('modalCarbs');
const modalFiber = document.querySelector('modalFiber');
const modalSugar = document.querySelector('modalSugar');
const modalSatFat = document.querySelector('modalSatFat');
const modalCholesterol = document.querySelector('modalCholesterol');
const modalSodium = document.querySelector('modalSodium');
const modalVitC = document.querySelector('modalVitC');
const modalCalcium = document.querySelector('modalCalcium');
const modalIron = document.querySelector('modalIron');
const modalPotassium = document.querySelector('modalPotassium');
const modalSourceLink = document.querySelector('modalSourceLink');

//Noftication Elements //
const notificationElement = document.querySelector('notifcation')

let currentFocusedSuggestion = -1; // For keyboard navigation in suggestions

//Dark Mode Functionality //
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});


searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchRecipes();
})

function displayRecipes(recipes) {
    let html = '';
    recipes.forEach((recipe) => {
        html += `
        <div>
            <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            <h3>${recipe.recipe.label}</h3>
            <ul>
                ${recipe.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
        </div> 
        `
    })
    resultsList.innerHTML = html;
}