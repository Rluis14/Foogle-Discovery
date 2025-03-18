import axios from 'axios';
//put api url here
const baseURL = 'http://127.0.0.1:5001/foogle-612c9/us-central1/api';
const api = axios.create({
    baseURL,
    timeout: 1000,
})

/**
 * Sign in a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<[any, any]>} - Result and error
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
}

/**
 * Sign up a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} user_name - User's name
 * @returns {Promise<[any, any]>} - Result and error
 */
export const signUp = async (email, password, user_name) => {
    let result = null;
    let error = null;
    try{
        const response = await api.post('/auth/register', {email, password, user_name});
        result = response.data;
    }catch(err){
        console.error(err);
        error = err;
    }
    return [result,error];
}

/**
 * Create a new recipe
 * @param {object} recipe - Recipe object
 * @param {string} recipe.title - Recipe title
 * @param {string} recipe.ingredients - Recipe ingredients
 * @param {string} recipe.area - Recipe area
 * @param {string} recipe.instruction - Recipe instruction
 * @param {string} recipe.category - Recipe category
 * @param {File} recipe.image - Recipe image
 * @returns {Promise<[any, any]>} - Result and error
 */
export const createRecipe = async (recipe) => {
    let result = null;
    let error = null;
    const token = localStorage.getItem('token');
    try{
        const form = new FormData();
        const recipeBody = recipe;
        //remove image out of recipe to avoid stringify
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
}

/**
 * Update an existing recipe
 * @param {string} id - Recipe ID
 * @param {object} recipe - Recipe object
 * @param {string} recipe.title - Recipe title
 * @param {string} recipe.ingredients - Recipe ingredients
 * @param {string} recipe.area - Recipe area
 * @param {string} recipe.instruction - Recipe instruction
 * @param {string} recipe.category - Recipe category
 * @param {File} recipe.image - Recipe image
 * @returns {Promise<[any, any]>} - Result and error
 */
export const updateRecipe = async (id, recipe) => {
    let result = null;
    let error = null;
    const token = localStorage.getItem('token');
    try {
        const form = new FormData();
        const recipeBody = recipe;
        recipeBody.image = undefined;
        form.append('json', JSON.stringify(recipeBody));
        form.append('image', recipe.image);
        const response = await api.put(`/recipe/${id}`, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token,
            }
        });
        result = response.data;
    } catch (err) {
        console.error(err);
        error = err;
    }
    return [result, error];
}

/**
 * Delete a recipe
 * @param {string} id - Recipe ID
 * @returns {Promise<[any, any]>} - Result and error
 */
export const deleteRecipe = async (id) => {
    let result = null;
    let error = null;
    const token = localStorage.getItem('token');
    try {
        const response = await api.delete(`/recipe/${id}`, {
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
}

/**
 * Create a new review
 * @param {string} user_id - User ID
 * @param {object} review - Review object
 * @param {string} review.title - Review title
 * @param {string} review.description - Review description
 * @param {number} review.rating - Review rating
 * @param {string} review.recipe_id - Recipe ID
 * @param {File} review.image - Review image
 * @returns {Promise<[any, any]>} - Result and error
 */
export const createReview = async (user_id,review) => {
    let result = null;
    let error = null;
    // body required
    // { title, description, rating, recipe_id, image }
    const token = localStorage.getItem('token');
    const form = new FormData();
    const reviewBody = review;
    //remove image out of review to avoid stringify
    reviewBody.image = undefined;
    form.append('json', JSON.stringify(reviewBody));
    form.append('image', review.image);
    try{
        const response = await api.post(`/review/${user_id}`, form,{
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
}

/**
 * Update an existing review
 * @param {string} id - Review ID
 * @param {object} review - Review object
 * @param {string} review.title - Review title
 * @param {string} review.description - Review description
 * @param {number} review.rating - Review rating
 * @param {File} review.image - Review image
 * @returns {Promise<[any, any]>} - Result and error
 */
export const updateReview = async (id, review) => {
    let result = null;
    let error = null;
    const token = localStorage.getItem('token');
    try {
        const form = new FormData();
        const reviewBody = review;
        reviewBody.image = undefined;
        form.append('json', JSON.stringify(reviewBody));
        form.append('image', review.image);
        const response = await api.put(`/review/${id}`, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token,
            }
        });
        result = response.data;
    } catch (err) {
        console.error(err);
        error = err;
    }
    return [result, error];
}

/**
 * Delete a review
 * @param {string} id - Review ID
 * @returns {Promise<[any, any]>} - Result and error
 */
export const deleteReview = async (id) => {
    let result = null;
    let error = null;
    const token = localStorage.getItem('token');
    try {
        const response = await api.delete(`/review/${id}`, {
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
}

/**
 * Get recipes by search criteria
 * @param {string|string[]} [title] - Recipe title(s)
 * @param {string|string[]} [category] - Recipe category(ies)
 * @param {string|string[]} [area] - Recipe area(s)
 * @returns {Promise<[any, any]>} - Result and error
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
}

/**
 * Get a recipe by ID
 * @param {string} id - Recipe ID
 * @returns {Promise<[any, any]>} - Result and error
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
}

/**
 * Get reviews by recipe ID
 * @param {string} recipe_id - Recipe ID
 * @returns {Promise<[any, any]>} - Result and error
 */
export const getReviewsByRecipeId = async (recipe_id) => {
    let result = null;
    let error = null;
    try {
        const response = await api.get(`/review/recipe/${recipe_id}`);
        result = response.data;
    } catch (err) {
        console.error(err);
        error = err;
    }
    return [result, error];
}

/**
 * Get reviews by user ID
 * @param {string} user_id - User ID
 * @returns {Promise<[any, any]>} - Result and error
 */
export const getReviewsByUserId = async (user_id) => {
    let result = null;
    let error = null;
    try {
        const response = await api.get(`/review/user/${user_id}`);
        result = response.data;
    } catch (err) {
        console.error(err);
        error = err;
    }
    return [result, error];
}

/**
 * Add a recipe to user's favorites
 * @param {string} id - Recipe ID
 * @returns {Promise<[any, any]>} - Result and error
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
}

/**
 * Remove a recipe from user's favorites
 * @param {string} id - Recipe ID
 * @returns {Promise<[any, any]>} - Result and error
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
}

/**
 * Get user's favorite recipes
 * @returns {Promise<[any, any]>} - Result and error
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
}

/**
 * Get recipes created by a user
 * @param {string} user_id - User ID
 * @returns {Promise<[any, any]>} - Result and error
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
}
