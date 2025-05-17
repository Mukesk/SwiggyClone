import React, { useState, useMemo } from "react";
import { TiShoppingCart } from "react-icons/ti";
import Carousel from "./carousel";
import CatCard from "./catCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import baseUrl from "../constant/baseUrl";
import ProductCard from "./productCard";
import { Link } from "react-router-dom";
import Footer from "./footer";
import { CiSearch } from "react-icons/ci";

const Home = () => {
  const [srchItem, setSrchItem] = useState("NULL");
  const [focused, setFocused] = useState(false);

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
  const { data: user } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/api/auth/me`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      console.log("User data fetched successfully", data);
    },
  });

  // Fetch cart items
  const { data: cartItems } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/api/items/getcartitems`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return res.data;
    },
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
      {/* Navbar */}
      <div className="navbar text-white py-2 bg-orange-400">
        <div className="flex px-4 py-3 justify-between items-center">
          <div className="brand text-2xl font-bold">Brand</div>
          <div className="search-bar flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 rounded border bg-gray-50 placeholder:text-black text-black border-gray-300"
              onChange={(e) => setSrchItem(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <button className="bg-gray-200 text-2xl text-black px-4 py-2 rounded">
              <CiSearch />
            </button>
          </div>
          <div className="links flex flex-row items-center gap-3">
            <abbr title={`${user?.username}`}>
              <img
                src="./images/profile.jpg"
                alt="profile"
                className="h-10 w-10 rounded-full"
              />
            </abbr>
            <Link to="/cart" className="flex items-center gap-1 text-xl">
              <TiShoppingCart className="text-4xl" />
              Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Search Suggestion Box */}
      {focused && srchItem.trim() !== "" && filteredItems.length > 0 && (
        <div className="p-4 w-2/3 mx-auto absolute left-1/6 bg-white rounded-lg shadow-lg mt-4 z-10">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between border-b py-2 text-gray-800"
            >
              <span>{item.itemname}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
        </div>
      )}

      {/* Carousel */}
      <Carousel />

      {/* Category Section */}
      <div className="text-3xl text-center mt-6 font-bold">Category</div>
      <div className="flex flex-wrap justify-center gap-5 mt-4">
        {Object.entries(categories).map(([category, image]) => (
          <CatCard key={category} cat={category} imgSrc={image} />
        ))}
      </div>

      {/* Products per Category */}
      {isLoading ? (
        <div className="text-center mt-6 text-xl">Loading items...</div>
      ) : error ? (
        <div className="text-center mt-6 text-red-500">
          Error fetching items: {error.message}
        </div>
      ) : (
        Object.entries(categories).map(([category]) => (
          <div key={category}>
            <div className="text-3xl text-center mt-6 font-bold">{category}</div>
            <div className="flex flex-wrap justify-center gap-5 mt-4">
              {items?.items
                ?.filter((item) => item.category === category)
                .map((item) => (
                  <ProductCard
                    key={item._id}
                    id={item._id}
                    title={item.itemname}
                    description={item.description}
                    price={item.price}
                    image={item.img}
                    isNew={true}
                    isAdded={
                      !!cartItems?.items?.some(
                        ({ _id }) => _id.toString() === item._id.toString()
                      )
                    }
                  />
                ))}
            </div>
          </div>
        ))
      )}

      {/* Footer */}
      <div className="footer text-center bg-gray-200 mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
