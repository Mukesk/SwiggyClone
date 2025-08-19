import React, { useEffect, useState } from "react";
import { useCart } from "./myContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "../constant/baseUrl";
import { loadStripe } from "@stripe/stripe-js";
import "./cart.css";
import Loader from "./loader";
import { IoExitOutline } from "react-icons/io5";
import { Link } from "react-router-dom";


const stripePromise = loadStripe("pk_test_51RLdujGIFC7YAJ2piwwzaigrxOGtxUFenfVNVlsYGG8TLVD4zJXdJpUaXzSLY2sQdnS6fML49ClDWGsRvo7ihry000idTgqpSW");

const Cart = () => {
  const queryClient = useQueryClient();
  const [totalAmount, setTotalAmount] = useState(0);
const {mutate:removetitem,isPending:removing}=useMutation({
  mutationFn:async(id)=>{
    const res= await axios.post(`${baseUrl}/api/items/removecartitem/${id}`, {},{
        withCredentials: true,
      headers: { "Content-Type": "application/json" },
      });
      return res.data;

  },
  onSuccess: () => {
      queryClient.invalidateQueries(["cartItems"]);
    }
})
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

  const { mutate: increment ,isPending:isIncrementPending } = useMutation({
    mutationFn: async (id) => {
      await axios.post(`${baseUrl}/api/items/increment/${id}`, {}, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cartItems"]);
    },
  });

  const { mutate: decrement,isPending:isDecrementPending } = useMutation({
    mutationFn: async (id) => {
      await axios.post(`${baseUrl}/api/items/decrement/${id}`, {}, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cartItems"]);
    },
  });

  const { mutate: makePayment } = useMutation({
    mutationFn: async () => {
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
        alert(result.error.message);
      }
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
    <div className="cart-header">
      <h1 className="cart-title text-4xl flex justify-between navbar p-2 text-white py-2 bg-orange-400">
        <div className="title">Your Cart</div>
     <Link to={"/"}> <IoExitOutline /></Link></h1>
      

    </div>
      {data.items.length === 0 ? (
        <div className="empty-cart text-center mt-6 text-xl">Your cart is empty</div>
      ) : (
      
     
      
      <div>{
        
      data.items.map((item) => (
        <div className="maind" key={item.id}>
          <div className="cont">
            <div className="sub">
              <img src={item.img} alt={item.itemname} />
              <h1>{item.itemname}</h1>
              <h5>{item.brand}</h5>
              <p>Rs. {item.price}</p>
            </div> 
            <div className="sub2">
              <div className="counter">
                <button className={" rounded text-amber-50 bg-orange-400   m-2"} onClick={() => increment(item._id)}>+</button>
                <p>{(isDecrementPending||isIncrementPending?<Loader/>: item.quantity)}</p>
                <button className={" text-amber-50 bg-orange-400   rounded m-2"}  onClick={() => decrement(item._id)}>-</button>
              </div>
             
            </div> <div onClick={()=>removetitem(item._id)} className={"rounded p-2 me-3 text-amber-50 bg-orange-400  "}>remove</div>
          </div>
        </div>
      )) }
      <div className="amount">
        <h3>Total Amount: Rs. {totalAmount.toFixed(2)}</h3>
        <button className={"rounded text-amber-50 bg-orange-400  "} onClick={() => makePayment()}>Place Order</button>
      </div>
      
      </div>
 
    
  
      
  )



}
</>)};


export default Cart;
