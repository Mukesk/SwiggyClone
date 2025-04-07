import React from "react";
import { TiShoppingCart } from "react-icons/ti";
import Carousel from "./carousel";
import CatCard from "./catCard";
import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import baseUrl from "../constant/baseUrl";
import ProductCard from "./productCard";
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
  const handleAddToCart = () => {
    console.log("Item added to cart!");
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
      
    {Object.entries(cat).map((cats)=>(
      <div>
       <div className="text-3xl text-center mt-6 font-bold">{cats[0]}</div>
        <div className="flex flex-wrap justify-center gap-5 mt-4">
         {items?.items?.filter((item) => item.category === cats).map((item) => (
          <ProductCard
          title={item.name}
          description={item.description}
        
          price={item.price}
          key={item._id}
          isNew={true}
          image={item.image}
          onAddToCart={handleAddToCart}
        />
     
        ))}
      </div>
      </div>
      ))}
    



    </div>


  );
};

export default Home;
