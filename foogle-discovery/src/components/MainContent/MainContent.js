import './MainContent.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const MainContent = () => {
  const navigate = useNavigate();  // Initialize navigate function

  return (
    <main>
      <div className="main-content">
        <div className="get-started">
          <h1>Discover Your Next Favorite Meal</h1>
          <div className="action-buttons">
            <button className="search-btn" onClick={() => navigate('/search')}>
              🔍 Search Recipes
            </button>
            <button className="filter-btn" onClick={() => navigate('/filter')}>
              ⚙️ Filter by Diet
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
