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
    <div className="relative w-full mx-auto overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Futuristic Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,107,53,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,107,53,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-red-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-yellow-500/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Scanning Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent absolute top-1/3 w-full animate-pulse"></div>
          <div className="h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent absolute bottom-1/3 w-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
      </div>

      {/* Main Carousel Container */}
      <div className="relative h-80 md:h-96 lg:h-[500px] flex items-center justify-center">
        {/* 3D Perspective Container */}
        <div className="relative w-full h-full flex items-center justify-center" style={{perspective: '1000px'}}>
          
          {/* Side Images with 3D Effect */}
          <div className="hidden lg:flex absolute left-0 right-0 justify-between items-center h-full px-20 z-10">
            {/* Left Side Images */}
            <div className="flex flex-col space-y-4">
              <div className="transform rotate-y-15 scale-75 opacity-40 hover:opacity-70 transition-all duration-500">
                <img
                  src={images[getIndex(-2)]}
                  alt="Preview"
                  className="w-24 h-32 object-cover rounded-xl border border-orange-500/30 shadow-lg"
                />
              </div>
              <div className="transform rotate-y-15 scale-90 opacity-60 hover:opacity-80 transition-all duration-500">
                <img
                  src={images[getIndex(-1)]}
                  alt="Previous"
                  className="w-32 h-40 object-cover rounded-xl border border-orange-500/50 shadow-xl"
                />
              </div>
            </div>
            
            {/* Right Side Images */}
            <div className="flex flex-col space-y-4">
              <div className="transform -rotate-y-15 scale-90 opacity-60 hover:opacity-80 transition-all duration-500">
                <img
                  src={images[getIndex(1)]}
                  alt="Next"
                  className="w-32 h-40 object-cover rounded-xl border border-orange-500/50 shadow-xl"
                />
              </div>
              <div className="transform -rotate-y-15 scale-75 opacity-40 hover:opacity-70 transition-all duration-500">
                <img
                  src={images[getIndex(2)]}
                  alt="Preview"
                  className="w-24 h-32 object-cover rounded-xl border border-orange-500/30 shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Main Center Image with Holographic Effect */}
          <div className="relative z-20 group">
            {/* Holographic Border */}
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 rounded-3xl opacity-75 blur-lg group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-red-600 to-yellow-600 rounded-3xl opacity-50 group-hover:opacity-75 transition-all duration-500"></div>
            
            {/* Main Image */}
            <div className="relative bg-black rounded-2xl p-2 transform group-hover:scale-105 transition-all duration-700">
              <img
                src={images[getIndex(0)]}
                alt="Featured"
                className="h-64 md:h-80 lg:h-96 w-80 md:w-96 lg:w-[500px] object-cover rounded-xl transition-all duration-700"
              />
              
              {/* Futuristic Overlay */}
              <div className="absolute inset-2 rounded-xl bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none">
                {/* Scanning Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-400/20 to-transparent h-full animate-ping" style={{animationDuration: '3s'}}></div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                      Future Dining
                    </h3>
                    <p className="text-gray-300 text-lg opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300">
                      Experience next-generation food delivery
                    </p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 transform origin-left transition-transform duration-1000" 
                         style={{transform: `scaleX(${(currentIndex + 1) / images.length})`}}></div>
                  </div>
                </div>
                
                {/* Corner Elements */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-orange-400 opacity-60"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-orange-400 opacity-60"></div>
                <div className="absolute bottom-16 left-4 w-6 h-6 border-b-2 border-l-2 border-orange-400 opacity-60"></div>
                <div className="absolute bottom-16 right-4 w-6 h-6 border-b-2 border-r-2 border-orange-400 opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Futuristic Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-md hover:bg-black/70 text-orange-400 p-4 rounded-full border border-orange-500/30 hover:border-orange-400 transition-all duration-300 z-30 group"
        aria-label="Previous"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/0 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        <svg className="w-6 h-6 relative z-10 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-md hover:bg-black/70 text-orange-400 p-4 rounded-full border border-orange-500/30 hover:border-orange-400 transition-all duration-300 z-30 group"
        aria-label="Next"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/0 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        <svg className="w-6 h-6 relative z-10 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Advanced Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative group transition-all duration-500 ${
              index === currentIndex 
                ? 'transform scale-125' 
                : 'hover:scale-110'
            }`}
            aria-label={`Slide ${index + 1}`}
          >
            {/* Outer Ring */}
            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
              index === currentIndex
                ? 'border-orange-400 bg-orange-400/20'
                : 'border-gray-500 hover:border-orange-400/60'
            }`}>
              {/* Inner Dot */}
              <div className={`w-2 h-2 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                index === currentIndex
                  ? 'bg-orange-400 shadow-lg shadow-orange-400/50'
                  : 'bg-gray-600 group-hover:bg-orange-400/60'
              }`}></div>
            </div>
            
            {/* Progress Ring for Active */}
            {index === currentIndex && (
              <div className="absolute inset-0 rounded-full">
                <svg className="w-4 h-4 transform -rotate-90" viewBox="0 0 16 16">
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    fill="none"
                    stroke="rgba(251, 146, 60, 0.3)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    fill="none"
                    stroke="rgb(251, 146, 60)"
                    strokeWidth="1"
                    strokeDasharray="37.7"
                    strokeDashoffset="37.7"
                    className="animate-pulse"
                    style={{
                      animation: 'dash 3s linear infinite',
                    }}
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes dash {
          0% { stroke-dashoffset: 37.7; }
          100% { stroke-dashoffset: 0; }
        }
        
        .rotate-y-15 {
          transform: perspective(1000px) rotateY(15deg);
        }
        
        .-rotate-y-15 {
          transform: perspective(1000px) rotateY(-15deg);
        }
      `}</style>
    </div>
  );
};

export default Carousel;
