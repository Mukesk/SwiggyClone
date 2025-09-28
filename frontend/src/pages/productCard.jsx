import React, { useState } from "react";
import { useCart } from "./myContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "../constant/baseUrl";
import "./ProductCard.css";
import { useQueryClient } from "@tanstack/react-query";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast, showLoginRequiredToast } from "../utils/toastConfig";

const ProductCard = ({ id, title, description, isAdded, price, image }) => {
  const { setInitial } = useCart();  
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get current user
  const { data: user } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/auth/me`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        return res.data;
      } catch (error) {
        return null;
      }
    },
    retry: false,
  });

  const { mutate: addItem, isPending } = useMutation({
    mutationFn: async ({ id }) => {
      const res = await axios.post(`${baseUrl}/api/items/addcartitem/${id}`, {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cartItems"]);
      queryClient.invalidateQueries(["items"]);
      // Show success feedback
      const message = isAdded ? "Removed from cart!" : "Added to cart!";
      showSuccessToast(message);
    },
    onError: (error) => {
      console.error("Error updating cart:", error);
      showErrorToast("Something went wrong! Please try again.");
    },
  });

  const handleAdd = () => {
    // Check if user is logged in
    if (!user) {
      showLoginRequiredToast();
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      return;
    }

    addItem({ id });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };
 

  return (
    <div className="fresh-card" tabIndex={0} role="button" aria-label={`${title} - ₹${price}`}>
      <div className="fresh-image-container">
        {!imageLoaded && !imageError && (
          <div className="image-skeleton">
            <div className="animate-pulse bg-gray-200 w-full h-full flex items-center justify-center">
              <div className="text-gray-400 text-4xl">🍽️</div>
            </div>
          </div>
        )}
        
        {imageError ? (
          <div className="image-error bg-orange-100 w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-orange-400 text-4xl mb-2">🍽️</div>
              <p className="text-sm text-gray-500">Image not available</p>
            </div>
          </div>
        ) : (
          <img 
            src={image} 
            alt={title} 
            className={`fresh-image ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        <div className="hover-overlay">
          <button 
            className={`hover-button ${isPending ? 'loading' : ''}`} 
            onClick={handleAdd}
            disabled={isPending}
            aria-label={isAdded ? `Remove ${title} from cart` : `Add ${title} to cart`}
          >
            {isPending ? (
              <>
                <BiLoaderAlt className="animate-spin text-lg" />
                Processing...
              </>
            ) : isAdded ? (
              <>
                <FiTrash2 className="text-lg" />
                Remove
              </>
            ) : (
              <>
                <FiShoppingCart className="text-lg" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
      <div className="fresh-content">
        <h3 className="fresh-title" title={title}>{title}</h3>
        <p className="fresh-desc" title={description}>{description}</p>
        <div className="fresh-bottom">
          <span className="fresh-price">₹{price?.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
