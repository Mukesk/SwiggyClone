import React from "react";
import "./ProductCard.css";

const ProductCard = ({ title, description, price, image, onAddToCart }) => {
  return (
    <div className="fresh-card">
      <div className="fresh-image-container">
        <img src={image} alt={title} className="fresh-image" />
        <div className="hover-overlay">
          <button className="hover-button" onClick={onAddToCart}>
            🛒 Add to Cart
          </button>
        </div>
      </div>
      <div className="fresh-content">
        <h3 className="fresh-title">{title}</h3>
        <p className="fresh-desc">{description}</p>
        <div className="fresh-bottom">
          <span className="fresh-price">${price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
