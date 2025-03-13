import { useNavigate } from "react-router-dom";
import "./CreatedRecipesList.css";
import React, { useState,useEffect } from "react";
import RecipeCard from "../RecipeCard/RecipeCard";
import RecipeEditor from "../RecipeEditor/RecipeEditor";

const dummyRecipesOwner = [
  {
    id: 7,
    title: 'Spaghetti Carbonara',
    rating: 5,
    imgSrc: 'https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg',
    username: 'User test'
  },
  {
    id: 8,
    title: 'Chicken Alfredo',
    rating: 4,
    imgSrc: 'https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg',
    username: 'User test'
  }
];

function CreatedRecipesList() {
  const navigate = useNavigate();
  const [data,setData] = useState([]); 
  const [showEditor,setShowEditor] = useState(false); 
  const [editRecipe,setEditRecipe] = useState(null);
  useEffect(()=>{
    //fetch here
    setData(dummyRecipesOwner);
  },[])
  //navigate to recipe page
  const onClick = (id) => {};
  const onExit = ()=>{
    setShowEditor(false);
  }
  const onClickEdit = (id, saved) => {};
  const onAdd = () => {
    setShowEditor(true);
  };

  return (
    <React.Fragment>
      <h2 className="title">User's Recipes</h2>
      <div className="recipe_container">
      {data.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          title={recipe.title}
          rating={recipe.rating}
          imgSrc={recipe.imgSrc}
          username={recipe.username}
          onClick={onClick}
          onClickEdit={onClickEdit}
        />
      ))}
      <img src="/icon/add-icon.png" className="add_icon" alt="add icon" title="Add recipe" onClick={onAdd}/>
      </div>
      <RecipeEditor key={'editor'+showEditor} onExit={onExit} showed={showEditor}/>
    </React.Fragment>
  );
}
export default CreatedRecipesList;
