import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CiShoppingCart, CiHeart } from 'react-icons/ci';
import { HiStar } from 'react-icons/hi';

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const ProductCard = ({ 
  id, 
  title, 
  description, 
  price, 
  image, 
  category, 
  rating = 4.5,
  isAdded = false,
  className = "" 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  // Handle add to cart
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    // Check if user is logged in
    if (!user) {
      toast.warn("Please login to continue", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "bg-orange-50 text-orange-800 border border-orange-200",
        progressClassName: "bg-orange-400",
      });
      return;
    }

    if (isAdded) {
      toast.info("Item already in cart!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseUrl}/api/items/addtocart`,
        { itemId: id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Invalidate cart queries to refetch
        queryClient.invalidateQueries(["cartItems"]);
        
        toast.success("Added to cart successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: "bg-green-50 text-green-800 border border-green-200",
          progressClassName: "bg-green-400",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "bg-red-50 text-red-800 border border-red-200",
        progressClassName: "bg-red-400",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });
  };

  const handleCardClick = () => {
    // Navigate to product detail page
    navigate(`/product/${id}`);
  };

  return (
    <div 
      className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-100 overflow-hidden cursor-pointer max-w-sm w-full ${className}`}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
        <img
          src={image || '/api/placeholder/300/200'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = '/api/placeholder/300/200';
          }}
        />
        
        {/* Overlay Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-200 ${
            isLiked 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <CiHeart className={`text-lg ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            {category}
          </div>
        )}

        {/* Quick Add Button (appears on hover) */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`px-4 py-2 rounded-full font-medium text-sm shadow-lg transition-all duration-200 flex items-center space-x-2 ${
              isAdded
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-white text-orange-500 hover:bg-orange-50 border border-orange-200'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <CiShoppingCart className="text-lg" />
            )}
            <span>{isAdded ? 'Added' : 'Quick Add'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <HiStar 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({rating})</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description || "Delicious food prepared with fresh ingredients and served with love."}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-500">₹{price}</span>
            {/* You can add original price here if needed */}
            {/* <span className="text-sm text-gray-400 line-through">₹{originalPrice}</span> */}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`px-4 py-2 rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 ${
              isAdded
                ? 'bg-green-500 hover:bg-green-600 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transform hover:scale-105'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <CiShoppingCart className="text-lg" />
                <span>{isAdded ? 'Added' : 'Add'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  );
};

export default ProductCard;