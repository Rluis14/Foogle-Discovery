import React, { useState } from "react";
import "./SearchPage.css";

const SearchPage = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", query);
    // Add navigation or API call logic here
  };

  return (
    <div className="search-container">
      <img src="/Images/foogle-logo.jpg" alt="Foogle Logo" className="logo" />
      <input
        type="text"
        placeholder="Search Foogle..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <div className="button-container">
        <button onClick={handleSearch} className="search-button">Foogle Search</button>
        <button className="search-button">I'm Feeling Hungry</button>
      </div>
    </div>
  );
};

export default SearchPage;
