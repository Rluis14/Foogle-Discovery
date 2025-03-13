import React, { useRef, useState } from "react";
import AreaFood from "../../static/AreaFood";
import "./RecipeEditor.css";

const RecipeEditor = ({
  onExit = () => {},
  showed = false,
  onDelete = () => {},
  onAddRecipe = (recipe) => {},
  recipe,
}) => {
  const [title, setTitle] = useState(recipe?.title||"");
  const [instruction, setInstruction] = useState(recipe?.instruction||"");
  const [imgSrc, setImgSrc] = useState(recipe?.img||"");
  const [ingredients, setIngredients] = useState(recipe?.ingredients||[""]);
  const [selectionArea, setSectionArea] = useState(recipe?.area||"");
  const imgUploadRef = useRef(null);
  const imgUploadContainerRef = useRef(null);
  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event) => {
    //avoid make a copy when drag img to browser
    event.preventDefault();
    imgUploadContainerRef.current.style.borderColor = "black";
  };

  const handleDragExit = (event) => {
    //avoid make a copy when drag img to browser
    event.preventDefault();
    imgUploadContainerRef.current.style.borderColor = "#ccc";
  };

  const onAdd = (event) => {
    event.preventDefault();
    //require food image to submit
    if (!imgSrc) {
      alert("Please submit the food image");
      return;
    }
    const newRecipe = {
      title,
      instruction,
      imgSrc,
      ingredients,
    };
    console.log(newRecipe);
    onAddRecipe(newRecipe);
    onExit();
    // Add your logic here
  };

  const onCancel = () => {
    onExit();
    // Add your logic here
  };
  if (!showed) return null;
  return (
    <div
      className="recipe_editor_container"
      onClick={(e) => {
        e.stopPropagation();
        onExit();
      }}
    >
      <div className="recipe_editor" onClick={(e) => e.stopPropagation()}>
        <h2 className="recipe_editor_title">Add New Recipe</h2>
        <form className="recipe_form" onSubmit={onAdd}>
          <div className="form_group">
            <label>Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form_group">
            <label>Instruction</label>
            <select
              value={selectionArea}
              onChange={(e) => setSectionArea(e.target.value)}
            >
              <option value="">Select Area</option>
              {AreaFood.map((area, index) => (
                <option key={index} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          <div className="form_group">
            <label>Instruction</label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />
          </div>
          <div className="form_group">
            <label>Image</label>
            <div
              ref={imgUploadContainerRef}
              onClick={() => imgUploadRef.current.click()}
              className="drop_box"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragExit}
            >
              <p>Drag & drop an image here, or click to select one</p>
              <input
                type="file"
                name="imgUpload"
                accept="image/*"
                ref={imgUploadRef}
                onChange={handleImageUpload}
              />
              {imgSrc && (
                <img src={imgSrc} alt="Recipe" className="preview_img" />
              )}
            </div>
          </div>
          <div className="form_group ingredient_form">
            <label>Ingredients</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient_input">
                <input
                  type="text"
                  required
                  value={ingredient}
                  onChange={(e) =>
                    handleIngredientChange(index, e.target.value)
                  }
                />
                <button
                  type="button"
                  className="remove_ingredient_button"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add_ingredient_button"
              onClick={handleAddIngredient}
            >
              Add Ingredient
            </button>
          </div>
          <div className="form_actions">
            {recipe&&<button className="delete_button" onClick={onCancel}>
              Delete
            </button>}
            <button className="cancel_button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

{
  /* <div className="form_group">
  <label>Area</label>
  <textarea
    value={area}
    onChange={(e) => setArea(e.target.value)}
  />
</div> */
}
export default RecipeEditor;
