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
    try{
        const form = new FormData();
        form.append('json', JSON.stringify(recipe));
        form.append('image', recipe.image);
        const response = await api.post('/recipe', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        result = response.data;
    }catch(err){
        console.error(err);
        error = err;
    }
    return [result,error];
}