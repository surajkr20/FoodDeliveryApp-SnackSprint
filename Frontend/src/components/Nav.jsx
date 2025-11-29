import React, { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";

const Nav = () => {
  const { userData } = useSelector((state) => state.user);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  return (
    <div className="w-full h-20 flex items-center justify-between md:justify-center gap-[30px] px-5 fixed top-0 z-9999 bg-[#fff9f6] overflow-visible">
      <h1 className="md:text-3xl text-2xl font-bold mb-2 text-[#ff4d2d]">SnackSprint</h1>

      {showSearchInput == true && <div className="w-[90%] h-[60px] fixed top-16 bg-white shadow-xl rounded-lg flex items-center gap-5 md:hidden">
        {/* location and city */}
        <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400">
          <CiLocationOn size={25} className="text-[#ff4d2d]" />
          <div className="w-[80%] truncate text-gray-600">Patna</div>
        </div>
        {/* search input */}
        <div className="w-[80%] flex items-center gap-2.5">
          <IoIosSearch size={25} className="text-[#ff4d2d]" />
          <input
            type="text"
            placeholder="search delicious foods.."
            className="w-full px-2.5 outline-none text-gray-700"
          />
        </div>
      </div>}

      {/* search div for foods and location */}
      <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-5 md:flex hidden">
        {/* location and city */}
        <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400">
          <CiLocationOn size={25} className="text-[#ff4d2d]" />
          <div className="w-[80%] truncate text-gray-600">Patna</div>
        </div>
        {/* search input */}
        <div className="w-[80%] flex items-center gap-2.5">
          <IoIosSearch size={25} className="text-[#ff4d2d]" />
          <input
            type="text"
            placeholder="search delicious foods.."
            className="w-full px-2.5 outline-none text-gray-700"
          />
        </div>
      </div>

      <div className=" flex items-center gap-4">
        {showSearchInput ? <RxCross2 className="text-[#ff4d2d] md:hidden text-2xl" onClick={()=>setShowSearchInput(false)}/> 
        : <IoIosSearch size={25} className="text-[#ff4d2d] md:hidden text-2xl" onClick={()=>setShowSearchInput(true)}/>}

        {/* Cart */}
        <div className="relative cursor-pointer">
          <FiShoppingCart size={25} className="text-[#ff4d2d]" />
          <span className=" absolute right-[-9px] -top-3 ">0</span>
        </div>

        {/* My order button */}
        <button className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium cursor-pointer">
          My Orders
        </button>

        {/* Profile */}
        <div className="bg-[#ff4d2d] p-2 rounded-full w-[30px] h-[30px] flex items-center justify-center font-semibold shadow-xl text-white text-[18px] cursor-pointer"
          onClick={()=>setShowInfo(prev=>!prev)}
        >
          {userData?.fullname.slice(0, 1)}
        </div>

        {/* Profile popup */}
        {showInfo == true && <div className="fixed top-20 right-2.5 md:right-[10%] lg:right-[25%] w-[180px] bg-white shadow-2xl rounded-xl p-4 flex flex-col z-9999 overflow-hidden gap-1">
          <div className="text-[14px] text-gray-800 font-semibold truncate">{userData.fullname}</div>
          <div className="text-[14px] text-gray-800 font-semibold truncate">{userData.email}</div>
          <div className="text-[#ff4d2d] font-semibold md:hidden cursor-pointer">My Orders</div>
          <div className="text-[#ff4d2d] font-semibold cursor-pointer">Log out</div>
        </div>}
      </div>
    </div>
  );
};

export default Nav;
