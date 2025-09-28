import React from "react";

const CatCard = ({ cat, imgSrc }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="group cursor-pointer">
        <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-gray-100 w-40 h-40 flex flex-col items-center justify-center">
          {/* Background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Icon/Image Container */}
          <div className="relative z-10 mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={cat}
                  className="w-10 h-10 object-cover rounded-full filter brightness-0 invert"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <span className="text-2xl text-white font-bold" style={{display: imgSrc ? 'none' : 'block'}}>
                {getCategoryIcon(cat)}
              </span>
            </div>
          </div>
          
          {/* Category Name */}
          <h3 className="relative z-10 text-center font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 text-sm leading-tight">
            {cat}
          </h3>
        </div>
      </div>
    </div>
  );
};

// Function to get category icons
const getCategoryIcon = (category) => {
  const icons = {
    'Biryani': '🍚',
    'Pizza': '🍕',
    'Burger': '🍔',
    'Veg': '🥗',
    'Non-Veg': '🍗',
    'Beverage': '🥤',
    'Bakery': '🧁',
    'Dessert': '🍰',
    'Chinese': '🥢',
    'Indian': '🍛'
  };
  return icons[category] || '🍽️';
};

export default CatCard;
