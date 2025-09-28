import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { CiSearch } from 'react-icons/ci';
import { HiSparkles, HiTruck, HiClock, HiStar } from 'react-icons/hi';

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const LandingPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  // Fetch all products
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/items/getallitems`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        return res.data?.items || [];
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
  });

  // Fetch cart items for checking if items are already added
  const { data: cartItems } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/items/getcartitems`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        return res.data?.items || [];
      } catch (error) {
        return [];
      }
    },
  });

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery.trim()) return products;
    
    return products.filter(product => 
      product.itemname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped = {};
    filteredProducts?.forEach(product => {
      const category = product.category || 'Others';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  }, [filteredProducts]);

  // Check if product is in cart
  const isProductInCart = (productId) => {
    return cartItems?.some(item => item._id === productId);
  };

  const categories = Object.keys(productsByCategory);

  if (error) {
    toast.error("Failed to load products. Please try again.");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Delicious Food
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400">
                  Delivered Fast
                </span>
              </h1>
              <p className="text-lg md:text-xl text-orange-100 mb-8 leading-relaxed max-w-lg">
                Order from your favorite restaurants and get fresh, hot meals delivered right to your doorstep in minutes.
              </p>
              
              {/* Feature Icons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
                <div className="flex items-center space-x-2 text-orange-100">
                  <HiTruck className="text-2xl text-yellow-300" />
                  <span className="font-medium">Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2 text-orange-100">
                  <HiStar className="text-2xl text-yellow-300" />
                  <span className="font-medium">Top Rated</span>
                </div>
                <div className="flex items-center space-x-2 text-orange-100">
                  <HiClock className="text-2xl text-yellow-300" />
                  <span className="font-medium">24/7 Service</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-white text-orange-600 hover:bg-orange-50 font-bold py-4 px-8 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Order Now
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold py-4 px-8 rounded-full transition-all duration-200">
                  View Menu
                </button>
              </div>
            </div>

            {/* Hero Image/Animation */}
            <div className="relative">
              <div className="relative w-80 h-80 mx-auto lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-30 animate-ping animation-delay-100"></div>
                <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-8xl animate-bounce">🍽️</div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 bg-yellow-300 rounded-full p-3 animate-float shadow-lg">
                  <HiSparkles className="text-orange-600 text-xl" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-red-400 rounded-full p-3 animate-float animation-delay-200 shadow-lg">
                  <HiStar className="text-white text-xl" />
                </div>
                <div className="absolute top-1/2 -right-8 bg-orange-300 rounded-full p-3 animate-float animation-delay-300 shadow-lg">
                  <HiTruck className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Header */}
      {searchQuery && (
        <section className="bg-white py-8 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-gray-600 mt-1">
                  Found {filteredProducts?.length || 0} items
                </p>
              </div>
              <div className="flex items-center text-orange-500">
                <CiSearch className="text-xl mr-2" />
                <span className="font-medium">Searching...</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            /* Loading State */
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading delicious food...</h3>
              <p className="text-gray-500">Please wait while we fetch the best meals for you</p>
              
              {/* Skeleton Loading */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-2xl"></div>
                    <div className="bg-white p-6 rounded-b-2xl border border-t-0">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="text-center py-20">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
              <p className="text-gray-600 mb-6">We couldn't load the menu items. Please try again.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts?.length === 0 ? (
            /* No Results State */
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No items found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? `No results found for "${searchQuery}"` : "No products available"}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => window.location.href = '/'} 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200"
                >
                  View All Products
                </button>
              )}
            </div>
          ) : (
            /* Products Display */
            <>
              {!searchQuery && (
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Our Menu
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover our delicious selection of fresh, made-to-order meals from top-rated restaurants
                  </p>
                </div>
              )}

              {/* Display products by category or all together */}
              {searchQuery ? (
                /* Search Results - All in one grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      title={product.itemname}
                      description={product.description}
                      price={product.price}
                      image={product.img}
                      category={product.category}
                      isAdded={isProductInCart(product._id)}
                    />
                  ))}
                </div>
              ) : (
                /* Category-wise Display */
                categories.map((category) => (
                  <div key={category} className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                          {category}
                          <span className="ml-3 text-lg">
                            {category === 'Pizza' && '🍕'}
                            {category === 'Burger' && '🍔'}
                            {category === 'Biryani' && '🍚'}
                            {category === 'Chinese' && '🥢'}
                            {category === 'Dessert' && '🍰'}
                            {category === 'Beverage' && '🥤'}
                            {!['Pizza', 'Burger', 'Biryani', 'Chinese', 'Dessert', 'Beverage'].includes(category) && '🍽️'}
                          </span>
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {productsByCategory[category]?.length} items available
                        </p>
                      </div>
                      <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center transition-colors duration-200">
                        View All
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {productsByCategory[category]?.map((product) => (
                        <ProductCard
                          key={product._id}
                          id={product._id}
                          title={product.itemname}
                          description={product.description}
                          price={product.price}
                          image={product.img}
                          category={product.category}
                          isAdded={isProductInCart(product._id)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!searchQuery && (
        <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Order?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of happy customers and get your favorite food delivered in minutes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 hover:bg-orange-50 font-bold py-4 px-8 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg">
                Start Ordering
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold py-4 px-8 rounded-full transition-all duration-200">
                Download App
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;