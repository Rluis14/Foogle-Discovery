import React, { useState } from "react";
import { fetchAndStoreMeal } from "../../API/api";
import { getAuth } from "firebase/auth";
import axios from "axios";
import "./SearchPage.css";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  // Fetch meals from TheMealDB (Public)
  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      if (response.data.meals) {
        setResults(response.data.meals);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  // Save a meal to Firestore for the logged-in user
  const handleSaveMeal = async (meal) => {
    if (!userId) {
      alert("Please sign in to save meals.");
      return;
    }
    await fetchAndStoreMeal(meal.strMeal, userId);
    alert(`Saved ${meal.strMeal} to your saved meals!`);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for a recipe..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div className="results-container">
        {results.length > 0 ? (
          results.map((meal) => (
            <div key={meal.idMeal} className="meal-card">
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <h3>{meal.strMeal}</h3>
              <button onClick={() => handleSaveMeal(meal)}>Save Meal</button>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
