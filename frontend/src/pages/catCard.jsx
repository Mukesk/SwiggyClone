import React from "react";

const CatCard = ({ cat, imgSrc }) => {
  return (
    <div className="flex justify-center items-center bg-gray-100">
      <a
        href="#"
        className="relative h-[321px] w-[220px] bg-white rounded-tr-lg overflow-hidden flex flex-col justify-center items-center shadow-lg transition-all duration-300 ease-out hover:scale-[1.005] hover:-translate-y-1 hover:shadow-2xl group"
      >
        {/* Hover Overlay */}
        <div className="absolute w-[118px] h-[118px] bg-orange-400 rounded-full top-[70px] left-[50px] transition-transform duration-300 ease-out group-hover:scale-[4]"></div>

        {/* Circle with Image */}
        <div className="relative flex justify-center items-center w-[131px] h-[131px] bg-white border-4 border-orange-400 rounded-full transition-all duration-300 ease-out group-hover:bg-[#DCE9FF] group-hover:border-[#f1f7ff]">
          <div className="absolute w-[118px] h-[118px] bg-orange-400 rounded-full transition-opacity duration-300 ease-out group-hover:bg-[#f1f7ff]"></div>

          <img
            src={imgSrc}
            alt={cat}
            className="relative z-10 w-[px] h-[77px] object-cover rounded-full"
          />
        </div>

        {/* Text */}
        <p className="mt-8 text-lg text-gray-700 transition-colors duration-300 ease-out group-hover:text-[#4C5656]">
          {cat}
        </p>
      </a>
    </div>
  );
};

export default CatCard;
