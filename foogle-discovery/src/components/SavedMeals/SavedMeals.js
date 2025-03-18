import React, { useEffect, useState } from "react";
import { getSavedMeals } from "../API/api";
import { getAuth } from "firebase/auth";

const SavedMeals = () => {
    const [meals, setMeals] = useState([]);
    const auth = getAuth();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    useEffect(() => {
        if (!userId) return;
        
        const fetchMeals = async () => {
            const savedMeals = await getSavedMeals(userId);
            setMeals(savedMeals);
        };

        fetchMeals();
    }, [userId]);

    return (
        <div className="saved-meals-container">
            <h2>Saved Meals</h2>
            <div className="meals-grid">
                {meals.length === 0 ? (
                    <p>No saved meals found.</p>
                ) : (
                    meals.map((meal) => (
                        <div key={meal.idMeal} className="meal-card">
                            <img src={meal.strMealThumb} alt={meal.strMeal} />
                            <h3>{meal.strMeal}</h3>
                            <p>{meal.strCategory} - {meal.strArea}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SavedMeals;
