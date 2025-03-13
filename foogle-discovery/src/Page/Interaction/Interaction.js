import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Interaction.css';

const Interaction = () => {
  const [recipeData, setRecipeData] = useState(null);
  
  //replace with actual API endpoint
  useEffect(() => {
    const fetchRecipeData = async () => {
    };
    
    fetchRecipeData();
  }, []);

  return (
    <div className="interaction-page">
      {/* Top Navigation */}
      <nav className="top-nav">
        <Link to="/account" className="user-account-btn">
          User Account
        </Link>
      </nav>

      {/* Main Content */}
      <div className="recipe-content">
        {recipeData && (
          <div className="recipe-card">
            <img src={recipeData.image} alt={recipeData.title} />
            <div className="recipe-details">
              <h2>{recipeData.title}</h2>
              <div className="recipe-meta">
                <span className="rating">
                  ★ {recipeData.rating} ({recipeData.reviews} reviews)
                </span>
                <span className="cook-time">⏲ {recipeData.cookTime}</span>
                <span className="difficulty">⚙️ {recipeData.difficulty}</span>
              </div>
              <p className="description">{recipeData.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <Link to="/add-review" className="nav-btn add-review-btn">
          Add Review
        </Link>
        <div className="right-buttons">
          <Link to="/search" className="nav-btn search-again-btn">
            Search Again?
          </Link>
          <Link to="/" className="nav-btn home-btn">
            Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Interaction;