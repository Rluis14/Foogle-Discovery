import React, { useState } from "react";
import "./FilterSearchPage.css";

const FilterSearchPage = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const foodCategories = ["Barbeque", "Breakfast", "Dessert", "Pasta", "Salad", "Soup"];

  const handleFilterChange = (category) => {
    setSelectedFilters((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleSearch = () => {
    console.log("Filtering for:", selectedFilters);
    // Add navigation or API call logic here
  };

  return (
    <div className="filter-container">
      <img src="/Images/foogle-logo.jpg" alt="Foogle Logo" className="logo" />
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
      <button onClick={handleSearch} className="filter-button">Search</button>
    </div>
  );
};

export default FilterSearchPage;
