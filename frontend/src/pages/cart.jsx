import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "../constant/baseUrl";
import { loadStripe } from "@stripe/stripe-js";
import "./cart.css";
import { IoExitOutline, IoTrashOutline } from "react-icons/io5";
import { FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";


const stripePromise = loadStripe("pk_test_51RLdujGIFC7YAJ2piwwzaigrxOGtxUFenfVNVlsYGG8TLVD4zJXdJpUaXzSLY2sQdnS6fML49ClDWGsRvo7ihry000idTgqpSW");

const Cart = () => {
  const queryClient = useQueryClient();
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutate: removeItem, isPending: isRemoving } = useMutation({
    mutationFn: async (id) => {
      const res = await axios.post(`${baseUrl}/api/items/removecartitem/${id}`, {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cartItems"]);
      toast.success("Item removed from cart!", {
        duration: 2000,
        position: 'bottom-center',
      });
    },
    onError: (error) => {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item!", {
        duration: 2000,
        position: 'bottom-center',
      });
    }
  });
  const { data, isLoading } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/api/items/getcartitems`, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      const total = data.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalAmount(total);
    },
  });
  useEffect(() => {
    if (data) {
      const total = data.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalAmount(total);
    }
  }, [data]);

  const { mutate: increment, isPending: isIncrementPending } = useMutation({
    mutationFn: async (id) => {
      const res = await axios.post(`${baseUrl}/api/items/increment/${id}`, {}, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cartItems"]);
    },
    onError: (error) => {
      console.error("Error incrementing quantity:", error);
      toast.error("Failed to update quantity!");
    },
  });

  const { mutate: decrement, isPending: isDecrementPending } = useMutation({
    mutationFn: async (id) => {
      const res = await axios.post(`${baseUrl}/api/items/decrement/${id}`, {}, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cartItems"]);
    },
    onError: (error) => {
      console.error("Error decrementing quantity:", error);
      toast.error("Failed to update quantity!");
    },
  });

  const { mutate: makePayment, isPending: isCheckoutPending } = useMutation({
    mutationFn: async () => {
      setIsProcessing(true);
      const res = await axios.post(`${baseUrl}/api/payment/create-checkout-session`, {
        data: data.items,
      }, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: async (session) => {
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) {
        console.error("Payment error:", result.error.message);
        setIsProcessing(false);
      }
    },
    onError: (error) => {
      console.error("Checkout error:", error);
      setIsProcessing(false);
    },
  });

  if (isLoading) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title text-4xl flex justify-between navbar p-4 text-white">
            <div className="title">Your Cart</div>
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <IoExitOutline />
            </Link>
          </h1>
        </div>
        <div className="cart-content">
          <div className="text-center py-16">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {/* Enhanced Mobile-First Header */}
      <div className="cart-header bg-gradient-to-r from-orange-500 to-orange-600 sticky top-0 z-10 shadow-lg">
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <FiShoppingBag className="text-2xl md:text-3xl text-white" />
            <h1 className="text-xl md:text-3xl font-bold text-white">Your Cart</h1>
          </div>
          <Link 
            to="/" 
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            title="Continue Shopping"
          >
            <IoExitOutline className="text-xl md:text-2xl" />
            <span className="hidden sm:inline text-sm font-medium">Continue Shopping</span>
          </Link>
        </div>
      </div>

      <div className="cart-content">
        {data?.items?.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2 className="empty-cart-title">Your cart is empty</h2>
            <p className="empty-cart-subtitle">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/" className="continue-shopping-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Enhanced Mobile-Optimized Cart Items */}
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
              {data.items.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col sm:flex-row">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 sm:h-32 flex-shrink-0">
                      <img 
                        src={item.img} 
                        alt={item.itemname} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-food.jpg';
                        }}
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.itemname}</h3>
                          {item.brand && <p className="text-sm text-gray-500 mb-2">{item.brand}</p>}
                          <div className="flex items-center justify-between sm:justify-start sm:flex-col sm:items-start gap-2">
                            <p className="text-xl font-bold text-orange-600">
                              ₹{item.price?.toLocaleString('en-IN')}
                            </p>
                            <p className="text-sm text-gray-500 sm:hidden">
                              Total: ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                        
                        {/* Mobile Controls */}
                        <div className="flex flex-col sm:flex-col gap-3 sm:items-end">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                            <button 
                              onClick={() => decrement(item._id)}
                              disabled={isDecrementPending || item.quantity <= 1}
                              className="p-2 rounded-full hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-gray-50 transition-colors duration-200"
                              title="Decrease quantity"
                            >
                              {isDecrementPending ? <BiLoaderAlt className="animate-spin text-gray-600" size={16} /> : <FiMinus className="text-gray-600" size={16} />}
                            </button>
                            <span className="px-4 py-1 font-semibold text-gray-900 min-w-[2rem] text-center">
                              {(isDecrementPending || isIncrementPending) ? (
                                <BiLoaderAlt className="animate-spin inline" size={16} />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button 
                              onClick={() => increment(item._id)}
                              disabled={isIncrementPending}
                              className="p-2 rounded-full hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-gray-50 transition-colors duration-200"
                              title="Increase quantity"
                            >
                              {isIncrementPending ? <BiLoaderAlt className="animate-spin text-gray-600" size={16} /> : <FiPlus className="text-gray-600" size={16} />}
                            </button>
                          </div>
                          
                          {/* Remove Button */}
                          <button 
                            onClick={() => removeItem(item._id)} 
                            disabled={isRemoving}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors duration-200 disabled:opacity-50 text-sm font-medium border border-red-200"
                            title="Remove from cart"
                          >
                            {isRemoving ? <BiLoaderAlt className="animate-spin" size={16} /> : <IoTrashOutline size={16} />}
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                          
                          {/* Desktop Item Total */}
                          <p className="hidden sm:block text-sm text-gray-500 font-medium">
                            Subtotal: ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Mobile-Optimized Cart Summary */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-xl">
              <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 mb-4 border border-orange-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <h3 className="text-3xl font-bold text-gray-900">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {data.items.length} item{data.items.length !== 1 ? 's' : ''} in your cart
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-gray-500 text-center">Free delivery on orders above ₹299</p>
                      {totalAmount < 299 && (
                        <p className="text-xs text-orange-600 text-center font-medium">
                          Add ₹{(299 - totalAmount).toLocaleString('en-IN')} more for free delivery!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => makePayment()}
                  disabled={isCheckoutPending || isProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center gap-3 text-lg"
                >
                  {isCheckoutPending || isProcessing ? (
                    <>
                      <BiLoaderAlt className="animate-spin text-2xl" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <FiShoppingBag className="text-xl" />
                      <span>Place Order Now</span>
                    </>
                  )}
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Secure payment powered by Stripe • 100% safe & secure
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default Cart;
