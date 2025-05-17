import React, { useEffect } from "react";
import { useCart } from "./myContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "../constant/baseUrl";
import "./ProductCard.css";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import Loader from "./loader";

const ProductCard = ({ id, title, description, isAdded,price, image }) => {
  const { setInitial } = useCart();  
  const queryClient = useQueryClient();

  const { mutate: addItem,isPending } = useMutation({
    mutationFn: async ({ id }) => {
      const res = await axios.post(`${baseUrl}/api/items/addcartitem/${id}`, {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      console.log("Item added to DB cart");
      queryClient.invalidateQueries(["cartItems"]);
      queryClient.invalidateQueries(["items"]);
    },
  });

  const handleAdd = () => {
    addItem({ id });
   
  };
 

  return (
    <div className="fresh-card">
      <div className="fresh-image-container">
        <img src={image} alt={title} className="fresh-image" />
        <div className="hover-overlay">
          <button className="hover-button" onClick={handleAdd}>
         {isPending?<Loader/> :(isAdded?" 🗑️ Remove from cart":"🛒 Add to Cart")}
          </button>
        </div>
      </div>
      <div className="fresh-content">
        <h3 className="fresh-title">{title}</h3>
        <p className="fresh-desc">{description}</p>
        <div className="fresh-bottom">
          <span className="fresh-price">₹{price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
