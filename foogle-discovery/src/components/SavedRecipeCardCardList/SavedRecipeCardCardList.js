import { useNavigate } from "react-router-dom";
import "./SavedRecipeCardCardList.css";
import React, { useState, useEffect } from "react";
import RecipeCard from "../RecipeCard/RecipeCard";
import axios from "axios";
const baseURL = "https://us-central1-foogle-6b1d1.cloudfunctions.net/api";
const dummyData = [
  {
    id: 7,
    title: "Spaghetti Carbonara",
    average_rating: 5,
    img_url:
      "https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg",
    saved: true,
    user_name: "User test",
  },
  {
    id: 8,
    title: "Chicken Alfredo",
    average_rating: 4,
    img_url:
      "https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg",
    saved: true,
    user_name: "User test",
  },
];
function SavedRecipeCardCardList() {
  // const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //fetch here
    // const res = await axios.get(`${baseURL}/favorites`);
    // const recipes = res.data.map((recipe) => ({
    //   id: recipe.mealId,
    //   title: recipe.mealName,
    //   rating: 5,
    //   imgSrc: recipe.mealThumb,
    //   username: "User " + Math.floor(Math.random() * 100),
    //   saved: true,
    // }));
    // setData(recipes);
    setData(dummyData);
    setLoading(false);
  }, []);

  //navigate to recipe page
  const onClick = (index) => {
    console.log("clicked", index);
  };

  const onClickSave = (index, saved) => {
    setData((prev) => {
      const newData = [...prev];
      newData[index].saved = saved;
      console.log(newData);
      return newData;
    });
  };

  return (
    <React.Fragment>
      <h2 className="title">User's Saved Recipes</h2>
      <div className="recipe_container">
        {loading ? ( 
          <p className="loading-message">Loading...</p>
        ) : data.length === 0 ? ( 
          <p className="no-recipes-message">No recipes saved.</p>
        ) : (
          data.map((recipe, index) => (
            <RecipeCard
              key={`${recipe.id} ${recipe.saved}`}
              title={recipe.title}
              rating={recipe.rating}
              imgSrc={recipe.img_url}
              username={recipe.username}
              onClickSave={() => onClickSave(index, !recipe.saved)}
              onClick={() => onClick(index)}
              saved={recipe.saved}
            />
          ))
        )}
      </div>
    </React.Fragment>
  );
}
export default SavedRecipeCardCardList;
