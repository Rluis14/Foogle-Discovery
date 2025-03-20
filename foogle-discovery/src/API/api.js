import axios from 'axios';
//put api url here
const baseURL = 'http://127.0.0.1:5001/foogle-service/us-central1/api';
const api = axios.create({
    baseURL,
    timeout: 5000,
})

/**
 * Fetch a meal by ID and store it in local storage
 * @param {string} mealId - The ID of the meal to fetch
 * @returns {Promise<[any, any]>} - Result and error
 */
export const fetchAndStoreMeal = async (mealId) => {
    let result = null;
    let error = null;
    try {
        const response = await api.get(`/recipe/${mealId}`);
        result = response.data;
        localStorage.setItem('meal', JSON.stringify(result)); // Store in local storage
    } catch (err) {
        console.error(err);
        error = err;
    }
    return [result, error];
};

/**
 * Sign in a user
 */
export const signIn = async (email, password) => {
    let result = null;
    let error = null;
    try{
        const response = await api.post('/auth/login', {email, password});
        result = response.data;
    }catch(err){
        console.error(err);
        error = err;
    }
    return [result,error];
};

/**
 * Sign up a new user
 */
export const signUp = async (email, password, user_name) => {
    let result = null;
    let error = null;
    try{
        const response = await api.post('/auth/sign_up', {email, password, user_name});
        result = response.data;
    }catch(err){
        console.error(err);
        error = err;
    }
    return [result,error];
};

/**
 * Create a new recipe
 */
export const createRecipe = async (recipe) => {
    let result = null;
    let error = null;
    const token = localStorage.getItem('token');
    try{
        const form = new FormData();
        const recipeBody = recipe;
        recipeBody.image = undefined;
        form.append('json', JSON.stringify(recipeBody));
        form.append('image', recipe.image);
        const response = await api.post('/recipe', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization':'Bearer ' + token,
            }
        });
        result = response.data;
    }catch(err){
        console.error(err);
        error = err;
    }
    return [result,error];
};

// Keep all other existing functions here...

/**
 * Get recipes by search criteria
 */
export const getRecipes = async (title, category, area) => {
    let result = null;
    let error = null;
    try {
        let params = {};
        if (title) params.title = Array.isArray(title) ? title.join(',') : title;
        if (category) params.category = Array.isArray(category) ? category.join(',') : category;
        if (area) params.area = Array.isArray(area) ? area.join(',') : area;
        const response = await api.get('/recipe/search', {
            params: params,
        });
        result = response.data;
    } catch (err) {
        console.error(err);
        error = err;
    }
    return [result, error];
};

/**
 * Get a recipe by ID
 */
export const getRecipeById = async (id) => {
    let result = null;
    let error = null;
    try{
        const response = await api.get(`/recipe/${id}`);
        result = response.data;
    }catch(err){
        console.error(err);
        error = err;
    }
    return [result,error];
};

/**
 * Add a recipe to user's favorites
 */
export const addFavoriteRecipe = async (id) => {
    let result = null;
    let error = null;
    const token = localStorage.getItem('token');
    try {
        const response = await api.post(`/user/recipe/favorites/${id}`, {}, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
        result = response.data;
    } catch (err) {
        console.error(err);
        error = err;
    }
    return [result, error];
};

/**
 * Remove a recipe from user's favorites
 */
export const removeFavoriteRecipe = async (id) => {
    let result = null;
    let error = null;
    const token = localStorage.getItem('token');
    try {
        const response = await api.delete(`/user/favorites/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
        result = response.data;
    } catch (err) {
        console.error(err);
        error = err;
    }
    return [result, error];
};

/**
 * Get user's favorite recipes
 */
export const getFavoriteRecipes = async () => {
    let result = null;
    let error = null;
    const token = localStorage.getItem('token');
    try {
        const response = await api.get('/recipe/favorites', {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
        result = response.data;
    } catch (err) {
        console.error(err);
        error = err;
    }
    return [result, error];
};

/**
 * Get recipes created by a user
 */
export const getUserRecipes = async (user_id) => {
    let result = null;
    let error = null;
    try {
        const response = await api.get(`/recipe/user/${user_id}`);
        result = response.data;
    } catch (err) {
        console.error(err);
        error = err;
    }
    return [result, error];
};
