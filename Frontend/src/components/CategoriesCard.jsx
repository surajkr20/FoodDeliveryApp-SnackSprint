import React from "react";

const CategoriesCard = ({ data }) => {
  return (
    <div
      className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-2xl border-2 border-[#ff4d2d] shrink-0 overflow-hidden
     bg-white shadow-xl shadow-gray-200 hover:shadow-lg transition-shadow relative"
    >
      <img
        src={data.image}
        alt={data.category}
        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
      />
      <div
        className="absolute bottom-0 left-0 w-full bg-[#ffffff96] bg-opacity-95 px-3 py-1 rounded-t-xl shadow text-center
      text-sm font-medium text-gray-800 backdrop-blur"
      >
        {data.category}
      </div>
    </div>
  );
};

export default CategoriesCard;
