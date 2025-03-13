import "./ImageGrid.css";
const ImageGrid = () => {
  return (
    
    <div className="image-grid">
      <img src="Images/pasta.jpg" alt="Pasta" className="food-image" />
      <img src="Images/salad.jpg" alt="Salad" className="food-image" />
      <img src="Images/dessert.jpg" alt="Dessert" className="food-image" />
      <img src="Images/breakfest.jpg" alt="Breakfast" className="food-image" />
      <img src="Images/soup.jpg" alt="Soup" className="food-image" />
      <img src="Images/barbeque.jpg" alt="Barbecue" className="food-image" />
    </div>
  );
};

export default ImageGrid;
