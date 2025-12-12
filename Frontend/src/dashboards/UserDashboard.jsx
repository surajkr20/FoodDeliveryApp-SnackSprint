import React, { useState } from "react";
import Nav from "../components/Nav";
import { categories } from "../categories.js";
import CategoriesCard from "../components/CategoriesCard.jsx";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { IoChevronForwardCircleSharp } from "react-icons/io5";
import { useReducer } from "react";

const UserDashboard = () => {
  const cartScrollRef = useReducer();
  const [categoryScrollLeftButton, setCategoryScrollLeftButton] = useState(false);
  const [categoryScrollRightButton, setCategoryScrollRightButton] = useState(false);

  const handleScrollButton = (ref, setCategoryScrollLeftButton, setCategoryScrollRightButton) =>{

  }

  const scrollHandler = (ref, direction)=> {
    if(ref.current){
      ref.current.scrollBy({
        left: direction=="left" ? -200 : 200,
        behaviour: "smooth"
      })
    }
  }

  return (
    <div className="w-screen pt-20 min-h-screen bg-[#fff9f6] flex flex-col items-center gap-5 overflow-y-auto">
      <Nav />

      <div className="w-full xl:px-20 lg:px-28 max-w-6xl flex flex-col items-start gap-5 px-6">
        <h1 className="text-gray-800 text-xl sm:text-2xl">
          Inspiration for your first order
        </h1>
        <div className="w-full relative">
          <button className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-[#ff4d2d] text-white rounded-full shadow-lg
          p-1 hover:bg-[#e64528]" ref={cartScrollRef} onClick={()=>scrollHandler(cartScrollRef, "left")}>
            <IoChevronBackCircleSharp size={30}/>
          </button>
          <div className="w-full flex overflow-x-auto gap-4 pb-2" ref={cartScrollRef}>
            {categories.map((cart, idx) => (
              <CategoriesCard data={cart} key={idx} />
            ))}
          </div>
          <button className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-[#ff4d2d] text-white rounded-full shadow-lg
          p-1 hover:bg-[#e64528]" onClick={()=>scrollHandler(cartScrollRef, "right")}>
            <IoChevronForwardCircleSharp size={30}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
