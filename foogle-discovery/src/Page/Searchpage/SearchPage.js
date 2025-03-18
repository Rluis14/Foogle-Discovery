import React, { useState } from "react";
import "./SearchPage.css";

const API_BASE_URL = "https://us-central1-your-project-id.cloudfunctions.net/api"; // Replace with your Firebase API URL

const CombinedSearchPage = () => {
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const foodCategories = ["Barbeque", "Breakfast", "Dessert", "Pasta", "Salad", "Soup"];

  // Handle search function
  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await axios.get(`${API_BASE_URL}/meals/search/${query}`);
      let meals = response.data.meals || [];

      // Apply category filters
      if (selectedFilters.length > 0) {
        meals = meals.filter(meal => selectedFilters.some(filter => meal.strCategory.includes(filter)));
      }

      setResults(meals);
    } catch (err) {
      setError("Error fetching meals. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  // Handle category selection
  const handleFilterChange = (category) => {
    setSelectedFilters((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="combined-container">
      <img src="/Images/foogle-logo.jpg" alt="Foogle Logo" className="logo" />

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Foogle..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      {/* Search Buttons */}
      <div className="button-container">
        <button onClick={handleSearch} className="search-button">Foogle Search</button>
        <button className="search-button">I'm Feeling Hungry</button>
      </div>

      {/* Filter Section */}
      <div className="filter-options">
        {foodCategories.map((category) => (
          <label key={category} className="filter-label">
            <input
              type="checkbox"
              value={category}
              checked={selectedFilters.includes(category)}
              onChange={() => handleFilterChange(category)}
            />
            {category}
          </label>
        ))}
      </div>

      <button onClick={handleSearch} className="filter-button">Apply Filters</button>

      {/* Display Results */}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="results-container">
        {results.length > 0 ? (
          results.map((meal) => (
            <div key={meal.idMeal} className="meal-card">
              <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-image" />
              <h3>{meal.strMeal}</h3>
              <p>Category: {meal.strCategory}</p>
            </div>
          ))
        ) : (
          !loading && <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default CombinedSearchPage;