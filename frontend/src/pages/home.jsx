import React from "react";
import { TiShoppingCart } from "react-icons/ti";
import Carousel from "./carousel";
import CatCard from "./catCard";
import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import baseUrl from "../constant/baseUrl";

const Home = () => {
    const {data:items,isLoading} = useQuery({
        queryKey:["items"],
        queryFn:async()=>{
            const res = await axios.get(`${baseUrl}/api/items/getallitems`,{
                headers:{"Content-Type":"application/json"},
                withCredentials:true,
            });
            console.log(res.data)
            return res.data;
        },
    });
  const cat = {
    Bakery: "./images/bakery.png",
    Burger: "./images/burger.png",
    Pizza: "./images/pizza.png",
    Veg: "./images/veg.png",
   " Non-Veg": "./images/nonveg.png",
    Beverage: "./images/brevage.png",
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar text-white py-2 bg-orange-400">
        <div className="flex px-4 py-3  justify-between items-center">
          <div className="brand text-2xl">Brand</div>
          <div className="links flex flex-row items-center gap-3">
            <TiShoppingCart className="text-4xl" />
            <div className="text-xl">Cart</div>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <Carousel />

      {/* Category Section */}
      <div className="text-3xl text-center mt-6 font-bold">Category</div>
      <div className="flex flex-wrap justify-center gap-5 mt-4">
        {Object.entries(cat).map(([category, image]) => (
          <CatCard key={category} cat={category} imgSrc={image} />
        ))}
      </div>
      
    {cat.map((cats)=>(
      <div>
       <div className="text-3xl text-center mt-6 font-bold">{cats}</div>
        <div className="flex flex-wrap justify-center gap-5 mt-4">
         {items?.filter((item) => item.category === cats).map((item) => (
        <div key={item._id} className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-1/4">
          <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-t-lg" />
          <h2 className="text-xl font-semibold mt-2">{item.name}</h2>
          <p className="text-gray-600 mt-1">{item.description}</p>
          <p className="text-lg font-bold mt-2">₹{item.price}</p>
          <button className="bg-orange-400 text-white px-4 py-2 rounded mt-3">Add to Cart</button>
        </div>
        ))}
      </div>
      </div>
      ))}
    </div>

  );
};

export default Home;
