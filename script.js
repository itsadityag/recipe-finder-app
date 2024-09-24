document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('searchButton');
    const apiRecipesList = document.getElementById('api-recipes');
    
    const modal = document.getElementById('recipeModal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalSource = document.getElementById('modal-source');
    const modalIngredients = document.getElementById('modal-ingredients');
    const modalInstructions = document.getElementById('modal-instructions');
    const closeButton = document.querySelector('.close-button');

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm.length > 2) {
            fetchRecipesFromAPI(searchTerm);
        } else {
            apiRecipesList.innerHTML = '<p>Please enter a search term with at least 3 characters.</p>';
        }
    });

    async function fetchRecipesFromAPI(query) {
        const appId = '7edbb51b'; 
        const appKey = 'e350446d6c1d1fb2f889c7dcc3724af8'; 
        const url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}&to=40`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            displayApiRecipes(data.hits);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            apiRecipesList.innerHTML = '<p>There was an error fetching the recipes. Please try again later.</p>';
        }
    }
    function displayApiRecipes(apiRecipes) {
        apiRecipesList.innerHTML = '';
        if (apiRecipes.length === 0) {
            apiRecipesList.innerHTML = '<p>No recipes found. Please try a different search term.</p>';
            return;
        }

        apiRecipes.forEach(recipeData => {
            const recipe = recipeData.recipe;
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.label}">
                <div>
                    <h3>${recipe.label}</h3>
                   


                    <p><strong>Calories:</strong> ${Math.floor(recipe.calories)}</p>
                    
                    <p><strong>Source:</strong> ${recipe.source}</p>
                   
                    <button class="view-recipe">View Recipe</button>
                </div>
            `;
            li.querySelector('.view-recipe').addEventListener('click', () => {
                showModal(recipe);
            });
            apiRecipesList.appendChild(li);
        });
    }

    function showModal(recipe) {
        modalImage.src = recipe.image;
        modalTitle.textContent = recipe.label;
        modalSource.textContent = `Source: ${recipe.source}`;
        modalIngredients.innerHTML = '';
        recipe.ingredientLines.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            modalIngredients.appendChild(li);
        });
        // Assuming instructions are not available in the API response, we use the URL
        modalInstructions.innerHTML = `<a href="${recipe.url}" target="_blank">View full instructions here</a>`;
        modal.style.display = 'block';
        document.body.classList.add('modal-active');
    }

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-active');
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-active');
        }
    });
});
