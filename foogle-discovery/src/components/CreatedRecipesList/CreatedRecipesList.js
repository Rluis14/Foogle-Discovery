import { useNavigate } from "react-router-dom";
import "./CreatedRecipesList.css";
import React, { useState,useEffect } from "react";
import RecipeCard from "../RecipeCard/RecipeCard";
import RecipeEditor from "../RecipeEditor/RecipeEditor";
import { createRecipe } from "../../API/api";

const dummyRecipesOwner = [
  {
    id: 7,
    title: "Spaghetti Carbonara",
    average_rating: 5,
    img_url:
      "https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg",
    saved: true,
    user_name: "User test",
    area: "Italian",
    category: "Pasta",
    instruction: "Boil pasta. Cook pancetta. Mix eggs and cheese. Combine all.",
    ingredients: ["Pasta", "Pancetta", "Eggs", "Cheese"]
  },
  {
    id: 8,
    title: "Chicken Alfredo",
    average_rating: 4,
    img_url:
      "https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg",
    saved: true,
    user_name: "User test",
    area: "American",
    category: "Pasta",
    instruction: "Cook pasta. Prepare Alfredo sauce. Combine pasta and sauce.",
    ingredients: ["Pasta", "Chicken", "Cream", "Parmesan"]
  },
];

function CreatedRecipesList() {
  const navigate = useNavigate();
  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(true);
  const [showEditor,setShowEditor] = useState(false); 
  const [editRecipe,setEditRecipe] = useState(null);
  useEffect(()=>{
    //fetch here
    setData(dummyRecipesOwner);
    setLoading(false);
  },[])
  const onClick = (id) => {
  };
  const onExit = ()=>{
    setShowEditor(false);
  }
  const onClickEdit = (id) => {
    const recipe = data.find((recipe)=>recipe.id===id);
    setEditRecipe({...recipe,imgSrc:recipe.img_url});
    setShowEditor(true);
  };
  const onAdd = () => {
    setShowEditor(true);
  };
  const addRecipe = async (newRecipe) => {
    // const [result,error] = await createRecipe({
    //   title: newRecipe.title,
    //   instruction: newRecipe.instruction,
    //   image: newRecipe.imgSrc,
    //   ingredients: newRecipe.ingredients,
    //   area: newRecipe.selectionArea,
    //   category: newRecipe.category
    // });
    // if(error){
    //   console.error(error);
    //   return;
    // }
    // const {recipe} = result;
    const recipe = {
      id: Math.floor(Math.random() * 10000),
      title: newRecipe.title,
      average_rating: 4,
      img_url: newRecipe.imgSrc,
      user_name: 'User test'
    };
    setData([...data,recipe]);
    setShowEditor(false);
  };
  return (
    <React.Fragment>
      <h2 className="title">User's Recipes</h2>
      <div className="recipe_container">
      {data.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          title={recipe.title}
          rating={recipe.average_rating}
          imgSrc={recipe.img_url}
          username={recipe.user_name}
          onClick={onClick}
          onClickEdit={()=>onClickEdit(recipe.id,recipe.saved)}
        />
      ))}
      <img src="/icon/add-icon.png" className="add_icon" alt="add icon" title="Add recipe" onClick={onAdd}/>
      </div>
      <RecipeEditor key={'editor'+showEditor} recipe={editRecipe} onExit={onExit} onAddRecipe={addRecipe} showed={showEditor}/>
    </React.Fragment>
  );
}
export default CreatedRecipesList;
