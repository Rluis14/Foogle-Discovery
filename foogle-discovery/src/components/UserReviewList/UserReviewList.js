import { useNavigate } from "react-router-dom";
import React, { useState,useEffect } from "react";
import "./UserReviewList.css";
import ReviewCard from "../ReviewCard/ReviewCard";
const dummyReviews = [
  {
    id: 1,
    title: 'Delicious Pasta',
    description: 'This pasta was absolutely amazing! The sauce was rich and flavorful.',
    rating: 5,
    imgSrc: 'https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg',
    username: 'User test'
  },
  {
    id: 2,
    title: 'Tasty Burger',
    description: 'The burger was juicy and cooked to perfection. Highly recommend!',
    rating: 4,
    imgSrc: 'https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg',
    username: 'User test'
  },
  {
    id: 3,
    title: 'Yummy Pizza',
    description: 'The pizza had a perfect crust and the toppings were fresh and delicious.',
    rating: 5,
    imgSrc: 'https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg',
    username: 'User test'
  },
  {
    id: 4,
    title: 'Amazing Salad',
    description: 'This salad was a delightful mix of fresh greens, crunchy vegetables, and a tangy dressing. The portion size was generous, and the flavors were perfectly balanced. I especially loved the addition of avocado and the sprinkle of nuts on top. It was a refreshing and satisfying meal that I would definitely order again. Highly recommend for anyone looking for a healthy and delicious option! The salad was not only tasty but also visually appealing with vibrant colors. The dressing was light yet flavorful, complementing the fresh ingredients perfectly. It was a great choice for a light lunch or a side dish. The combination of textures and flavors made every bite enjoyable. I will definitely be coming back for more. The service was also excellent, with friendly staff and quick service. Overall, a fantastic experience!',
    rating: 5,
    imgSrc: 'https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg',
    username: 'User test'
  }
];
function UserReviewList() {
  const navigate = useNavigate();
  const [data,setData] = useState([]); 
    useEffect(()=>{
      //fetch here
      setData(dummyReviews);
    },[])
    
  //navigate to recipe page
  const onClick = (id) => {};

  const onClickEdit = (id, saved) => {};

  return (
    <React.Fragment>
      <h2 className="title">User's Reviews</h2>
      <div className="review_container">
      {data.map((review) => (
        <ReviewCard
        key={review.id}
        title={review.title}
        description={review.description}
        rating={review.rating}
        imgSrc={review.imgSrc}
        username={review.username}
        onClick={onClick}
        onClickEdit={onClickEdit}
        />
      ))}
      </div>
    </React.Fragment>
  );
}
export default UserReviewList;
