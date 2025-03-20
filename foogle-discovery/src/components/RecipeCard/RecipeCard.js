import React from 'react';
import './RecipeCard.css';
import ButtonIcon from '../ButtonIcon/ButtonIcon';
const RecipeCard = ({ title, rating, username, imgSrc, onClick,onClickEdit,onClickSave,saved=false }) => {
  return (
    <div className="recipe_card" onClick={onClick}>
      <div className='recipe_interact_container'>
      {onClickEdit && <ButtonIcon src={"/icon/edit.png"} alt={"edit"} onClick={(e)=>{e.stopPropagation();onClickEdit()}}/>}
      {onClickSave && <ButtonIcon src={`/icon/heart-${saved? 'filled':'unfilled'}.png`} alt="Save" onClick={(e)=>{e.stopPropagation();onClickSave()}}/>}
      </div>
      <img src={imgSrc} alt={title} className="recipe_card_img" />
      <div className="recipe_card_content">
        <h3 className="recipe_card_title">{title}</h3>
        <p className="recipe_card_rating">Rated: {rating}</p>
        <p className="recipe_card_username">Created by: {username}</p>
      </div>
    </div>
  );
};

export default RecipeCard;