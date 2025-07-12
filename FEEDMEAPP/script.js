// API credentials
const API_ID = '03521114';
const API_KEY = '25c5af13a81dc3dbf6ba5241d0902209';
const BASE_URL = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${API_ID}&app_key=${API_KEY}`;

// Edamam Account User ID 
const USER_ID = 'feed-me-web-app'; 

// DOM Elements
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
const cuisineFilter = document.querySelector('#cuisineFilter');
const dietFilter = document.querySelector('#dietFilter');
const healthFilter = document.querySelector('#healthFilter');
const recipeCardsContainer = document.querySelector('#recipeCardsContainer');
const darkModeToggle = document.querySelector('#darkModeToggle');
const loadingIndicator = document.querySelector('#loadingIndicator');
const searchSuggestionsContainer = document.querySelector('#searchSuggestionsContainer');
const initialMessage = document.querySelector('#initialMessage');

// Navigation Elements
const homeSection = document.querySelector('#homeSection');
const favoritesSection = document.querySelector('#favoritesSection');
const showHomeBtn = document.querySelector('#showHomeBtn');
const showFavoritesBtn = document.querySelector('#showFavoritesBtn');
const favoriteRecipesContainer = document.querySelector('#favoriteRecipesContainer');

// Modal Elements
const recipeModal = document.querySelector('#recipeModal');
const closeModalBtn = document.querySelector('#closeModalBtn');
const modalRecipeTitle = document.querySelector('#modalRecipeTitle');
const modalRecipeImage = document.querySelector('#modalRecipeImage');
const modalIngredientsList = document.querySelector('#modalIngredientsList');
const modalCalories = document.querySelector('#modalCalories');
const modalProtein = document.querySelector('#modalProtein');
const modalFat = document.querySelector('#modalFat');
const modalCarbs = document.querySelector('#modalCarbs');
const modalFiber = document.querySelector('#modalFiber');
const modalSugar = document.querySelector('#modalSugar');
const modalSatFat = document.querySelector('#modalSatFat');
const modalCholesterol = document.querySelector('#modalCholesterol');
const modalSodium = document.querySelector('#modalSodium');
const modalVitC = document.querySelector('#modalVitC');
const modalCalcium = document.querySelector('#modalCalcium');
const modalIron = document.querySelector('#modalIron');
const modalPotassium = document.querySelector('#modalPotassium');
const modalSourceLink = document.querySelector('#modalSourceLink');

// Notification Elements
const notificationElement = document.querySelector('#notification');

// Global Variables
let currentFocusedSuggestion = -1;
let favoriteRecipes = [];

// --- Utility Functions ---
function toFixedOrZero(num, fixed = 1) {
    return num ? num.toFixed(fixed) : '0';
}

// --- Dark Mode Functionality ---
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    favoriteRecipes = loadFavoriteRecipes();
    displayFavoriteRecipes();

    showSection(homeSection);
});

//API Interaction 
async function fetchRecipes() {
    const query = searchInput.value.trim();
    if (!query) {
        showNotification('Please enter a recipe name or ingredient to search.', 'info');
        recipeCardsContainer.innerHTML = '';
        initialMessage.classList.remove('hidden');
        return;
    }

    showLoading();
    initialMessage.classList.add('hidden');

    let url = `${BASE_URL}&q=${encodeURIComponent(query)}`;

    const cuisine = cuisineFilter.value;
    if (cuisine) {
        url += `&cuisineType=${encodeURIComponent(cuisine)}`;
    }

    const diet = dietFilter.value;
    if (diet) {
        url += `&diet=${encodeURIComponent(diet)}`;
    }

    const health = healthFilter.value;
    if (health) {
        url += `&health=${encodeURIComponent(health)}`;
    }

    try {
        const response = await fetch(url, {
            headers: {
                'Edamam-Account-User': USER_ID
            }
        });

        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage += `. Message: ${errorData.message}`;
                }
            } catch (jsonError) {
                console.warn("Could not parse error response as JSON:", jsonError);
            }
            throw new Error(errorMessage);
        }
        const data = await response.json();
        console.log("API Response:", data);

        if (data.hits && data.hits.length > 0) {
            displayRecipes(data.hits);
            saveSearchTerm(query);
        } else {
            recipeCardsContainer.innerHTML = '<p class="initial-message">No recipes found for your search criteria. Try a different query or adjust filters.</p>';
        }
    } catch (error) {
        console.error("Failed to fetch recipes:", error);
        showNotification(`Failed to fetch recipes: ${error.message || 'Please check your internet connection or try again later.'}`, 'error');
        recipeCardsContainer.innerHTML = '<p class="initial-message">Oops! Something went wrong while fetching recipes. Please check your internet connection or try again later.</p>';
    } finally {
        hideLoading();
    }
}

//Search Functionality
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetchRecipes();
});

cuisineFilter.addEventListener('change', fetchRecipes);
dietFilter.addEventListener('change', fetchRecipes);
healthFilter.addEventListener('change', fetchRecipes);

//Display Recipes 
function displayRecipes(hits) {
    recipeCardsContainer.innerHTML = '';

    if (hits.length === 0) {
        recipeCardsContainer.innerHTML = '<p class="initial-message">No recipes found for your search. Try different keywords or filters.</p>';
        return;
    }

    hits.forEach((hit) => {
        const recipe = hit.recipe;
        const isFavorited = favoriteRecipes.some(fav => fav.uri === recipe.uri);
        const favoriteIconClass = isFavorited ? 'favorited' : '';

        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.setAttribute('data-uri', recipe.uri);

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}">
            <div class="recipe-card-content">
                <h3>${recipe.label}</h3>
                <p><strong>Cuisine:</strong> ${recipe.cuisineType ? recipe.cuisineType.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ') : 'N/A'}</p>
                <p><strong>Diet:</strong> ${recipe.dietLabels.length > 0 ? recipe.dietLabels.join(', ') : 'N/A'}</p>
                <div class="recipe-card-actions">
                    <button class="view-recipe-btn">View Recipe</button>
                    <button class="favorite-btn ${favoriteIconClass}" data-uri="${recipe.uri}">
                        ${isFavorited ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        `;
        recipeCardsContainer.appendChild(recipeCard);

        const viewRecipeButton = recipeCard.querySelector('.view-recipe-btn');
        console.log("Attempting to attach listener. Button found:", viewRecipeButton); // LOG 1
        if (viewRecipeButton) {
            viewRecipeButton.addEventListener('click', () => {
                console.log("View Recipe button WAS CLICKED for:", recipe.label); // LOG 2
                openRecipeModal(recipe);
            });
        } else {
            console.error("View Recipe button NOT FOUND for recipe:", recipe.label); // LOG 3
        }

        recipeCard.querySelector('.favorite-btn').addEventListener('click', (event) => {
            toggleFavorite(recipe, event.currentTarget);
        });
    });
}

// --- UI Section Toggling ---
function showSection(sectionToShow) {
    homeSection.classList.add('hidden');
    favoritesSection.classList.add('hidden');
    showHomeBtn.classList.remove('active');
    showFavoritesBtn.classList.remove('active');

    sectionToShow.classList.remove('hidden');
    if (sectionToShow === homeSection) {
        showHomeBtn.classList.add('active');
    } else if (sectionToShow === favoritesSection) {
        showFavoritesBtn.classList.add('active');
        displayFavoriteRecipes();
    }
}

showHomeBtn.addEventListener('click', () => showSection(homeSection));
showFavoritesBtn.addEventListener('click', () => showSection(favoritesSection));

// --- Loading Indicator Functions ---
function showLoading() {
    loadingIndicator.classList.remove('hidden');
    recipeCardsContainer.innerHTML = '';
    initialMessage.classList.add('hidden');
    searchButton.disabled = true;
    searchInput.disabled = true;
    cuisineFilter.disabled = true;
    dietFilter.disabled = true;
    healthFilter.disabled = true;
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
    searchButton.disabled = false;
    searchInput.disabled = false;
    cuisineFilter.disabled = false;
    dietFilter.disabled = false;
    healthFilter.disabled = false;
}

// --- Notification Pop-up Functionality ---
function showNotification(message, type = 'info', duration = 3000) {
    notificationElement.textContent = message;
    notificationElement.className = `notification show ${type}`;
    notificationElement.setAttribute('aria-live', 'assertive');

    setTimeout(() => {
        notificationElement.classList.remove('show');
        notificationElement.removeAttribute('aria-live');
    }, duration);
}

// --- Search History/Suggestions ---
const MAX_SEARCH_HISTORY = 5;

function saveSearchTerm(term) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history = [term, ...history.filter(t => t !== term)].slice(0, MAX_SEARCH_HISTORY);
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

function loadSearchHistory() {
    return JSON.parse(localStorage.getItem('searchHistory')) || [];
}

function displaySearchSuggestions(terms) {
    searchSuggestionsContainer.innerHTML = '';
    currentFocusedSuggestion = -1;

    if (terms.length === 0 || searchInput.value.trim() === '') {
        searchSuggestionsContainer.classList.add('hidden');
        return;
    }

    terms.forEach((term, index) => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = term;
        suggestionItem.setAttribute('role', 'option');
        suggestionItem.setAttribute('id', `suggestion-${index}`);
        suggestionItem.addEventListener('click', () => {
            searchInput.value = term;
            fetchRecipes();
            searchSuggestionsContainer.classList.add('hidden');
        });
        searchSuggestionsContainer.appendChild(suggestionItem);
    });
    searchSuggestionsContainer.classList.remove('hidden');
}

function updateFocusedSuggestion(suggestions) {
    suggestions.forEach((item, index) => {
        if (index === currentFocusedSuggestion) {
            item.classList.add('focused');
            searchInput.setAttribute('aria-activedescendant', `suggestion-${item.id}`);
        } else {
            item.classList.remove('focused');
        }
    });
    if (currentFocusedSuggestion === -1) {
        searchInput.removeAttribute('aria-activedescendant');
    }
}

searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const history = loadSearchHistory();
    const filteredSuggestions = history.filter(term => term.toLowerCase().includes(query));
    displaySearchSuggestions(filteredSuggestions);
});

document.addEventListener('click', (event) => {
    if (!searchSuggestionsContainer.contains(event.target) && event.target !== searchInput) {
        searchSuggestionsContainer.classList.add('hidden');
    }
});

searchInput.addEventListener('keydown', (event) => {
    const suggestions = Array.from(searchSuggestionsContainer.children);
    if (suggestions.length === 0) return;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (currentFocusedSuggestion < suggestions.length - 1) {
            currentFocusedSuggestion++;
        } else {
            currentFocusedSuggestion = 0;
        }
        updateFocusedSuggestion(suggestions);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (currentFocusedSuggestion > 0) {
            currentFocusedSuggestion--;
        } else {
            currentFocusedSuggestion = suggestions.length - 1;
        }
        updateFocusedSuggestion(suggestions);
    } else if (event.key === 'Enter') {
        if (currentFocusedSuggestion !== -1) {
            suggestions[currentFocusedSuggestion].click();
        } else {
            fetchRecipes();
        }
        searchSuggestionsContainer.classList.add('hidden');
    } else if (event.key === 'Escape') {
        searchSuggestionsContainer.classList.add('hidden');
        currentFocusedSuggestion = -1;
    }
});

// --- Favorite Recipes Functionality ---
function loadFavoriteRecipes() {
    try {
        const storedFavorites = localStorage.getItem('favoriteRecipes');
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (e) {
        console.error("Error parsing favorite recipes from localStorage:", e);
        return [];
    }
}

function saveFavoriteRecipes() {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
}

function toggleFavorite(recipe, buttonElement) {
    const recipeUri = recipe.uri;
    const index = favoriteRecipes.findIndex(fav => fav.uri === recipeUri);

    if (index === -1) {
        favoriteRecipes.push(recipe);
        buttonElement.classList.add('favorited');
        buttonElement.innerHTML = '❤️';
        showNotification(`${recipe.label} added to favorites!`, 'success');
    } else {
        favoriteRecipes.splice(index, 1);
        buttonElement.classList.remove('favorited');
        buttonElement.innerHTML = '🤍';
        showNotification(`${recipe.label} removed from favorites.`, 'info');
    }
    saveFavoriteRecipes();
    if (!favoritesSection.classList.contains('hidden')) {
        displayFavoriteRecipes();
    }
}

function displayFavoriteRecipes() {
    favoriteRecipesContainer.innerHTML = '';

    if (favoriteRecipes.length === 0) {
        favoriteRecipesContainer.innerHTML = '<p class="initial-message">You haven\'t added any favorite recipes yet. Find some delicious recipes and mark them as favorites!</p>';
        return;
    }

    favoriteRecipes.forEach((recipe) => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.setAttribute('data-uri', recipe.uri);

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}">
            <div class="recipe-card-content">
                <h3>${recipe.label}</h3>
                <p><strong>Cuisine:</strong> ${recipe.cuisineType ? recipe.cuisineType.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ') : 'N/A'}</p>
                <p><strong>Diet:</strong> ${recipe.dietLabels.length > 0 ? recipe.dietLabels.join(', ') : 'N/A'}</p>
                <div class="recipe-card-actions">
                    <button class="view-recipe-btn">View Recipe</button>
                    <button class="favorite-btn favorited" data-uri="${recipe.uri}">
                        ❤️
                    </button>
                </div>
            </div>
        `;
        favoriteRecipesContainer.appendChild(recipeCard);

        recipeCard.querySelector('.view-recipe-btn').addEventListener('click', () => {
            openRecipeModal(recipe);
        });

        recipeCard.querySelector('.favorite-btn').addEventListener('click', (event) => {
            toggleFavorite(recipe, event.currentTarget);
        });
    });
}

// --- Recipe Modal Functionality ---
function openRecipeModal(recipe) {
    console.log("--> ENTERING openRecipeModal function");
    console.log("Recipe object received by modal:", recipe);

    if (!recipe) {
        console.error("Error: openRecipeModal received an undefined or null recipe object.");
        showNotification('Recipe details could not be loaded.', 'error');
        return;
    }

    // Basic content setup
    modalRecipeTitle.textContent = recipe.label || 'Untitled';
    modalRecipeImage.src = recipe.image || '';
    modalRecipeImage.alt = recipe.label || 'Recipe image';

    // Ingredients check
    if (recipe.ingredientLines && recipe.ingredientLines.length > 0) {
        modalIngredientsList.innerHTML = recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('');
    } else {
        modalIngredientsList.innerHTML = '<li>Ingredients not available.</li>';
    }

    const totalNutrients = recipe.totalNutrients || {};
    const dailyNutrients = recipe.totalDaily || {};

    const getNutrient = (nutrientCode, daily = false) => {
        const nutrient = daily ? dailyNutrients?.[nutrientCode] : totalNutrients?.[nutrientCode];
        if (!nutrient) return 'N/A';
        const quantity = toFixedOrZero(nutrient.quantity);
        const unit = nutrient.unit;
        const dailyValue = daily ? ` (${toFixedOrZero(nutrient.quantity)}% Daily)` : '';
        return `${quantity}${unit}${dailyValue}`;
    };

    modalCalories.innerHTML = toFixedOrZero(recipe.calories);
    modalProtein.innerHTML = getNutrient('PROCNT');
    modalFat.innerHTML = getNutrient('FAT');
    modalCarbs.innerHTML = getNutrient('CHOCDF');
    modalFiber.innerHTML = getNutrient('FIBTG');
    modalSugar.innerHTML = getNutrient('SUGAR');
    modalSatFat.innerHTML = getNutrient('FASAT');
    modalCholesterol.innerHTML = getNutrient('CHOLE');
    modalSodium.innerHTML = getNutrient('NA');
    modalVitC.innerHTML = getNutrient('VITC', true);
    modalCalcium.innerHTML = getNutrient('CA', true);
    modalIron.innerHTML = getNutrient('FE', true);
    modalPotassium.innerHTML = getNutrient('K', true);

    if (recipe.url && recipe.source) {
        modalSourceLink.href = recipe.url;
        modalSourceLink.textContent = `View Full Recipe on ${recipe.source}`;
    } else {
        modalSourceLink.href = '#';
        modalSourceLink.textContent = 'Source not available';
    }

    recipeModal.classList.add('visible');
    recipeModal.classList.remove('hidden'); 
    document.body.style.overflow = 'hidden';
}

function closeRecipeModal() {
    recipeModal.classList.remove('visible');
    document.body.style.overflow = '';
}

closeModalBtn.addEventListener('click', closeRecipeModal);

recipeModal.addEventListener('click', (event) => {
    if (event.target === recipeModal) {
        closeRecipeModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && recipeModal.classList.contains('visible')) {
        closeRecipeModal();
    }
});
