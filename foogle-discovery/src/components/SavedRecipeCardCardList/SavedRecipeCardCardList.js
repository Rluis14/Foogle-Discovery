import { useNavigate } from "react-router-dom";
import "./SavedRecipeCardCardList.css";
import React, { useState,useEffect } from "react";
import RecipeCard from "../RecipeCard/RecipeCard";
const dummyRecipes = [
    {
      id: 5,
      title: 'Spaghetti Carbonara',
      rating: 5,
      imgSrc: 'https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg',
      username: 'User test',
      saved:true,
    },
    {
      id: 6,
      title: 'Chicken Alfredo',
      rating: 4,
      imgSrc: 'https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg',
      username: 'User test',
      saved:true,
    }
  ];
function SavedRecipeCardCardList() {
  const navigate = useNavigate();
  const [data,setData] = useState([]); 
  useEffect(()=>{
    //fetch here
    setData(dummyRecipes);
  },[])
  //navigate to recipe page
  const onClick = (index) => {};

  const onClickSave = (index, saved) => {
    setData(prev=>{
      const newData = [...prev];
      newData[index].saved = !saved;
      console.log(newData);
      return newData;
    })
  };

  return (
    <React.Fragment>
      <h2 className="title">User's Saved Recipes</h2>
      <div className="recipe_container">
      {data.map((recipe,index) => (
        <RecipeCard
          key={`${recipe.id} ${recipe.saved}`}
          title={recipe.title}
          rating={recipe.rating}
          imgSrc={recipe.imgSrc}
          username={recipe.username}
          onClickSave={()=>onClickSave(index,recipe.saved)}
          onClick={()=>onClick(index)}
          saved={recipe.saved}
        />
      ))}
      </div>
      </React.Fragment>
  );
}
export default SavedRecipeCardCardList;
