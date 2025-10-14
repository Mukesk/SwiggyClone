import React, { useState, useMemo, useRef, useEffect } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { CiSearch, CiUser, CiLogout, CiHome } from "react-icons/ci";
import { HiMenu, HiX } from "react-icons/hi";
import Carousel from "./carousel";
import CatCard from "./catCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "../constant/baseUrl";
import ProductCard from "./productCard";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./footer";
import { showSuccessToast, showErrorToast } from "../utils/toastConfig";
import "./layout-fixes.css";

// Function to get category icons
const getCategoryIcon = (category) => {
  const icons = {
    'Biryani': '🍚',
    'Pizza': '🍕',
    'Burger': '🍔',
    'Veg': '🥗',
    'Non-Veg': '🍗',
    'Beverage': '🥤',
    'Bakery': '🧁',
    'Dessert': '🍰',
    'Chinese': '🥢',
    'Indian': '🍛'
  };
  return icons[category] || '🍽️';
};

const Home = () => {
  const [srchItem, setSrchItem] = useState("NULL");
  const [focused, setFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const profileRef = useRef(null);
  const menuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all items
  const {
    data: items,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/api/items/getallitems`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return res.data;
    },
  });

  // Fetch authenticated user
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/auth/me`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        return res.data;
      } catch (error) {
        return null; // User not authenticated
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(`${baseUrl}/api/auth/logout`, {}, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      
      queryClient.setQueryData(["authUser"], null);
      queryClient.removeQueries(["cartItems"]);
      
      showSuccessToast("Logged out successfully!");
      navigate('/');
      setIsProfileOpen(false);
    } catch (error) {
      showErrorToast("Error logging out. Please try again.");
    }
  };

  // Fetch cart items
  const { data: cartItems } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      if (!user) return { items: [] };
      try {
        const res = await axios.get(`${baseUrl}/api/items/getcartitems`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        return res.data;
      } catch (error) {
        return { items: [] };
      }
    },
    enabled: !!user,
  });

  const categories = {
    Bakery: "./images/bakery.png",
    Burger: "./images/burger.png",
    Pizza: "./images/pizza.png",
    Veg: "./images/veg.png",
    "Non-Veg": "./images/nonveg.png",
    Beverage: "./images/brevage.png", // corrected spelling
  };

  // Filtered search results
  const filteredItems = useMemo(() => {
    if (!items?.items || srchItem === "NULL" || srchItem.trim() === "") return [];
    return items.items.filter((item) =>
      item.itemname.toLowerCase().includes(srchItem.toLowerCase())
    );
  }, [items, srchItem]);

  return (
    <div>
      {/* Fixed Navbar */}
      <nav className="bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-2 hover:opacity-90 transition-opacity duration-200"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-orange-500 font-bold text-lg">🍽️</span>
                </div>
                <span className="text-white text-xl sm:text-2xl font-bold tracking-tight">
                  BiteMe
                </span>
              </Link>
            </div>
            
            {/* Search Bar - Hidden on mobile, shown on tablet+ */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search delicious food..."
                  className="w-full px-4 py-2 text-sm bg-white text-gray-900 placeholder-gray-500 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  onChange={(e) => setSrchItem(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 200)}
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors duration-200">
                  <CiSearch className="text-lg" />
                </button>
              </div>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="flex items-center space-x-1 text-white hover:text-orange-200 transition-colors duration-200 font-medium"
              >
                <CiHome className="text-xl" />
                <span>Home</span>
              </Link>

              {/* Cart Link */}
              <Link 
                to="/cart" 
                className="relative flex items-center space-x-1 text-white hover:text-orange-200 transition-colors duration-200 font-medium group"
              >
                <div className="relative">
                  <TiShoppingCart className="text-xl group-hover:scale-110 transition-transform duration-200" />
                  {cartItems?.items?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {cartItems.items.length}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>

              {/* User Authentication */}
              {userLoading ? (
                <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
              ) : user ? (
                // Logged in - Show profile dropdown
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors duration-200 font-medium focus:outline-none"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <CiUser className="text-lg" />
                    </div>
                    <span className="hidden lg:block">{user.username}</span>
                    <svg 
                      className={`w-4 h-4 transform transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                        <p className="text-sm text-gray-600">{user.username}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <CiUser className="mr-2 text-lg" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <CiLogout className="mr-2 text-lg" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Not logged in - Show login button
                <Link
                  to="/login"
                  className="bg-white text-orange-500 hover:bg-orange-50 font-semibold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-orange-200 transition-colors duration-200 focus:outline-none"
              >
                {isMenuOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
              </button>
            </div>
          </div>
          
          {/* Mobile search bar */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search delicious food..."
                className="w-full px-4 py-2 text-sm bg-white text-gray-900 placeholder-gray-500 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                onChange={(e) => setSrchItem(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors duration-200">
                <CiSearch className="text-lg" />
              </button>
            </div>
          </div>
        </div>

            {/* Enhanced Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-b from-orange-600 to-orange-700 border-t border-orange-400 shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {/* Mobile User Info */}
              {user && (
                <div className="bg-orange-500/30 rounded-lg p-3 mb-4 border border-orange-400/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <CiUser className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Welcome back!</p>
                      <p className="text-orange-100 text-xs">{user.username}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-white hover:bg-orange-500/50 rounded-xl transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <CiHome className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                <span className="font-medium">Home</span>
              </Link>
              
              <Link
                to="/cart"
                className="flex items-center justify-between px-4 py-3 text-white hover:bg-orange-500/50 rounded-xl transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <TiShoppingCart className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                  <span className="font-medium">My Cart</span>
                </div>
                {cartItems?.items?.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                    {cartItems.items.length}
                  </span>
                )}
              </Link>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-white hover:bg-orange-500/50 rounded-xl transition-all duration-200 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <CiUser className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                    <span className="font-medium">My Profile</span>
                  </Link>
                  
                  <div className="border-t border-orange-500/30 mt-4 pt-4">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-white bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all duration-200 group border border-red-400/30"
                    >
                      <CiLogout className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-orange-500/30 mt-4 pt-4 space-y-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center w-full px-4 py-3 bg-white text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-semibold shadow-lg transform hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-white text-white hover:bg-white hover:text-orange-600 rounded-xl transition-all duration-200 font-semibold transform hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Search Suggestions with Add to Cart */}
      {focused && srchItem.trim() !== "" && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-lg mx-4 bg-white rounded-lg shadow-xl border border-gray-200 z-40 overflow-hidden">
          {filteredItems.length > 0 ? (
            <>
              <div className="px-4 py-2 bg-orange-50 border-b border-orange-100">
                <p className="text-sm text-gray-600 font-medium">Found {filteredItems.length} results</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {filteredItems.map((item) => {
                  const isInCart = cartItems?.items?.some(
                    ({_id}) => _id.toString() === item._id.toString()
                  );
                  
                  const handleAddToCart = async (e) => {
                    e.stopPropagation();
                    if (!user) {
                      showErrorToast("Please login to add items to cart");
                      navigate('/login');
                      return;
                    }
                    
                    try {
                      await axios.post(`${baseUrl}/api/items/additems`, 
                        { id: item._id },
                        {
                          headers: { "Content-Type": "application/json" },
                          withCredentials: true,
                        }
                      );
                      queryClient.invalidateQueries(["cartItems"]);
                      showSuccessToast(`${item.itemname} added to cart!`);
                    } catch (error) {
                      showErrorToast("Error adding item to cart");
                    }
                  };
                  
                  return (
                    <div
                      key={item._id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-orange-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-orange-500 text-sm">🍽️</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-medium text-sm truncate">{item.itemname}</p>
                          <p className="text-gray-500 text-xs truncate">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span className="text-orange-500 font-bold text-sm">₹{item.price}</span>
                        {isInCart ? (
                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                            Added ✓
                          </span>
                        ) : (
                          <button
                            onClick={handleAddToCart}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 flex items-center space-x-1"
                          >
                            <span>+</span>
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-sm">No items found for "{srchItem}"</p>
            </div>
          )}
        </div>
      )}

      {/* Carousel */}
      <Carousel />

      {/* Enhanced Category Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">Discover your favorite cuisines from our diverse menu selection</p>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
            {Object.entries(categories).map(([category, image]) => (
              <div key={category} className="w-full flex justify-center">
                <CatCard cat={category} imgSrc={image} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Products per Category */}
      <div className="bg-white">
        {isLoading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-xl text-gray-600">Loading delicious items...</p>
            </div>
            {/* Skeleton Loading */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-2xl"></div>
                  <div className="bg-white p-4 rounded-b-2xl border border-t-0">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">We couldn't load the menu items. Please try again.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : (
          Object.entries(categories).map(([category]) => {
            const categoryItems = items?.items?.filter((item) => item.category === category) || [];
            
            if (categoryItems.length === 0) return null;
            
            return (
              <section key={category} id={`category-${category}`} className="py-16 border-b border-gray-100 last:border-b-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Category Header */}
                  <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                      {category} 
                      <span className="text-2xl ml-2">{getCategoryIcon(category)}</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Fresh and delicious {category.toLowerCase()} items prepared with love
                    </p>
                    <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-orange-500 mx-auto mt-4 rounded-full"></div>
                  </div>
                  
                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 justify-items-center">
                    {categoryItems.map((item) => (
                      <div key={item._id} className="w-full max-w-sm">
                        <ProductCard
                          id={item._id}
                          title={item.itemname}
                          description={item.description}
                          price={item.price}
                          image={item.img}
                          user={user}
                          isAdded={
                            !!cartItems?.items?.some(
                              ({ _id }) => _id.toString() === item._id.toString()
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* View More Button */}
                  <div className="text-center mt-12">
                    <button className="inline-flex items-center px-6 py-3 border border-orange-300 rounded-full text-orange-600 hover:bg-orange-50 transition-colors duration-200 font-medium">
                      View All {category} Items
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="footer text-center bg-gray-200 mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
