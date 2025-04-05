import React, { useState, useEffect } from "react";

const images = [
    "./images/banner1.png",
    "./images/banner2.png",   
      "./images/banner3.png",
      "./images/banner4.png",
      "./images/banner5.png",
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const getIndex = (offset) => (currentIndex + offset) % totalSlides;

  return (
    <div className="relative w-100%  h-[400px] mx-auto overflow-hidden flex items-center">
      {/* Images Wrapper */}
      <div className="flex items-center transition-transform duration-700 ease-in-out gap-2">
        {/* Left (10% Width, Same Height) */}
        <img
          src={images[getIndex(0)]}
          alt="Left Image"
          className="h-[400px] w-[10%] object-cover opacity-50 transition-all duration-700"
        />

        {/* Center (80% Width, Same Height) */}
        <img
          src={images[getIndex(1)]}
          alt="Main Image"
          className="h-[400px] w-[80%] object-cover opacity-100 transition-all duration-700"
        />

        {/* Right (10% Width, Same Height) */}
        <img
          src={images[getIndex(2)]}
          alt="Right Image"
          className="h-[400px] w-[10%] object-cover opacity-50 transition-all duration-700"
        />
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 z-20"
      >
        ❮
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 z-20"
      >
        ❯
      </button>
    </div>
  );
};

export default Carousel;
