import axios from 'axios';
//put api url here
const baseURL = 'http://localhost:3001/api';
const api = axios.create({
    baseURL,
    timeout: 1000,
})

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

export const createReview = async (user_id,review) => {
    let result = null;
    let error = null;
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

export const getRecipes = async ({title,category,area}) => {
    let result = null;
    let error = null;
    try{
        let params = {};
        if(title) params.title = title;
        if(category) params.category = category;
        if(area) params.area = area;
        const response = await api.get('/recipe/search', {
            params: params,
        });
        result = response.data;
    }catch(err){
        console.error(err);
        error = err;
    }
    return [result,error];
}

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

export const getReviews = async (recipe_id) => {};
