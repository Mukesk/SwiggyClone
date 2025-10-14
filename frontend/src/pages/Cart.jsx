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
      <div className="cart-header">
        <h1 className="cart-title text-4xl flex justify-between navbar p-4 text-white">
          <div className="title flex items-center gap-3">
            <FiShoppingBag className="text-3xl" />
            Your Cart
          </div>
          <Link 
            to="/" 
            className="hover:opacity-80 transition-all duration-200 p-2 hover:bg-white/20 rounded-full"
            title="Continue Shopping"
          >
            <IoExitOutline className="text-3xl" />
          </Link>
        </h1>
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
            <div className="cart-items">
              {data.items.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div className="cart-item-content">
                    <img 
                      src={item.img} 
                      alt={item.itemname} 
                      className="cart-item-image"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-food.jpg';
                      }}
                    />
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.itemname}</h3>
                      {item.brand && <p className="cart-item-brand">{item.brand}</p>}
                      <p className="cart-item-price">
                        ₹{item.price?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn"
                          onClick={() => decrement(item._id)}
                          disabled={isDecrementPending || item.quantity <= 1}
                          title="Decrease quantity"
                        >
                          {isDecrementPending ? <BiLoaderAlt className="animate-spin" /> : <FiMinus />}
                        </button>
                        <span className="quantity-display">
                          {(isDecrementPending || isIncrementPending) ? (
                            <BiLoaderAlt className="animate-spin" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button 
                          className="quantity-btn"
                          onClick={() => increment(item._id)}
                          disabled={isIncrementPending}
                          title="Increase quantity"
                        >
                          {isIncrementPending ? <BiLoaderAlt className="animate-spin" /> : <FiPlus />}
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item._id)} 
                        className="remove-btn"
                        disabled={isRemoving}
                        title="Remove from cart"
                      >
                        {isRemoving ? <BiLoaderAlt className="animate-spin" /> : <IoTrashOutline />}
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3 className="cart-total">
                Total Amount: ₹{totalAmount.toLocaleString('en-IN')}
              </h3>
              <button 
                className="checkout-btn"
                onClick={() => makePayment()}
                disabled={isCheckoutPending || isProcessing}
              >
                {isCheckoutPending || isProcessing ? (
                  <>
                    <BiLoaderAlt className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default Cart;
