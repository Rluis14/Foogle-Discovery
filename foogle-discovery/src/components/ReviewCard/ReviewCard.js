import React from 'react';
import './ReviewCard.css';
import ButtonIcon from '../ButtonIcon/ButtonIcon';

const ReviewCard = ({ title, description, rating, imgSrc, username, onClick,onClickEdit }) => {
  return (
    <div className="review_card" onClick={onClick}>
      {onClickEdit && <ButtonIcon src={"/icon/edit.png"} alt={"edit"} onClick={(e)=>{e.stopPropagation();onClickEdit()}}/>}
      <img src={imgSrc} alt={title} className="review_card_img" />
      <div className="review_card_content">
        <h3 className="review_card_title">{title}</h3>
        <p className="review_card_rating">Rating: {rating}</p>
        <p className="review_card_username">Reviewed by: {username}</p>
        <div className="review_card_description">{description}</div>
      </div>
    </div>
  );
};

export default ReviewCard;