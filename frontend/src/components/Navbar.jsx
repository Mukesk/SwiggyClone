import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CiSearch, CiShoppingCart, CiUser, CiLogout, CiHome } from 'react-icons/ci';
import { HiMenu, HiX } from 'react-icons/hi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const profileRef = useRef(null);
  const menuRef = useRef(null);

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

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(`${baseUrl}/api/auth/logout`, {}, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      
      queryClient.setQueryData(["authUser"], null);
      queryClient.removeQueries(["cartItems"]);
      
      toast.success("Logged out successfully!");
      navigate('/');
      setIsProfileOpen(false);
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchFocused(false);
    }
  };

  const cartItemCount = cartItems?.items?.length || 0;

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
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

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for food, restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="w-full px-4 py-2 pl-10 text-sm bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                />
                <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors duration-200"
                >
                  <CiSearch className="text-sm" />
                </button>
              </form>
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
                  <CiShoppingCart className="text-xl group-hover:scale-110 transition-transform duration-200" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {cartItemCount}
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

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for food, restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 text-sm bg-white text-gray-900 placeholder-gray-500 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
              <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors duration-200"
              >
                <CiSearch className="text-sm" />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-orange-600 border-t border-orange-400">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-white hover:bg-orange-500 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <CiHome className="mr-2 text-xl" />
                Home
              </Link>
              
              <Link
                to="/cart"
                className="flex items-center px-3 py-2 text-white hover:bg-orange-500 rounded-lg transition-colors duration-200 relative"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <CiShoppingCart className="mr-2 text-xl" />
                  Cart
                  {cartItemCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 text-white hover:bg-orange-500 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <CiUser className="mr-2 text-xl" />
                    Profile ({user.username})
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-white hover:bg-red-500 rounded-lg transition-colors duration-200"
                  >
                    <CiLogout className="mr-2 text-xl" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 bg-white text-orange-500 hover:bg-orange-50 rounded-lg transition-colors duration-200 font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;