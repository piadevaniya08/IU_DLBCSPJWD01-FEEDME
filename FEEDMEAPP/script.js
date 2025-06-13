// API credentials //
const API_ID = '03521114'; 
const API_KEY = 'b78d120616494dca7c991ec429d5411a'; 
const BASE_URL = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${API_ID}&app_key=${API_KEY}`;
// DOM //
const searchform = document.querySelector('form');
const searchInput = document.querySelector('#search')
const resultsList = document.querySelector('#results')

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