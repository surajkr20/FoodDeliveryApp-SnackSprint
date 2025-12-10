import React, { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { FiPlusCircle } from "react-icons/fi";
import { BsCartPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const Nav = () => {
  const { userData, city, country } = useSelector((state) => state.user);
  const { shopData } = useSelector((state)=>state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      console.log("logout successfully");
    } catch (error) {
      console.log(`signout error: ${error}`);
    }
  };

  switch (userData.role) {
    case "user":
      return (
        <div className="w-full h-20 flex items-center justify-between md:justify-center gap-[30px] px-5 fixed top-0 z-9999 bg-[#fff9f6]">
          <h1 className="md:text-3xl text-2xl font-bold mb-2 text-[#ff4d2d]">
            SnackSprint
          </h1>

          {/* search div for foods and location for small devices */}
          {showSearchInput == true && (
            <div className="w-[90%] h-[60px] fixed top-16 bg-white shadow-xl rounded-lg flex items-center gap-5 md:hidden">
              {/* location and city */}
              <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400">
                <CiLocationOn size={25} className="text-[#ff4d2d]" />
                <div className="w-[80%] truncate text-gray-600">{city}</div>
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
          )}

          {/* search div for foods and location */}
          <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-5 md:flex hidden">
            {/* location and city */}
            <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400">
              <CiLocationOn size={25} className="text-[#ff4d2d]" />
              <div className="w-[80%] truncate text-gray-600">{city}</div>
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
            {/* search icon for small devices - user */}
            {showSearchInput ? (
              <RxCross2
                className="text-[#ff4d2d] md:hidden text-2xl"
                onClick={() => {
                  setShowSearchInput(false);
                  setShowInfo(false);
                }}
              />
            ) : (
              <IoIosSearch
                size={25}
                className="text-[#ff4d2d] md:hidden text-2xl"
                onClick={() => {
                  setShowSearchInput(true);
                  setShowInfo(false);
                }}
              />
            )}

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
            <div
              className="bg-[#ff4d2d] p-2 rounded-full w-[30px] h-[30px] flex items-center justify-center font-semibold shadow-xl text-white text-[18px] cursor-pointer"
              onClick={() => {
                setShowInfo((prev) => !prev);
                setShowSearchInput(false);
              }}
            >
              {userData?.fullname.slice(0, 1)}
            </div>

            {/* Profile popup */}
            {showInfo == true && (
              <div className="fixed w-[200px] md:w-auto top-20 right-4 md:right-[10%] lg:right-[18%] bg-white shadow-2xl rounded-xl px-4 py-4 flex flex-col items-start z-9999 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] text-gray-800 font-semibold truncate">
                    {userData.fullname}
                  </span>
                  <span className="text-[14px] text-gray-800 font-semibold truncate">
                    {userData.email}
                  </span>
                  <span className="text-[14px] text-gray-800 font-semibold truncate">
                    {country.toUpperCase().slice(0, 2)} - {userData.mobile}
                  </span>
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <button className="text-[#993a29] text-[14px] font-semibold md:hidden cursor-pointer bg-[#ff4d2d]/20 p-1 rounded-md w-full">
                    My Orders
                  </button>
                  <button
                    className="text-[#993a29] text-[14px] font-semibold cursor-pointer bg-[#ff4d2d]/20 p-1 rounded-md w-full"
                    onClick={handleSignOut}
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case "owner":
      return (
        <div className="w-full fixed top-0 left-0 z-9999 h-20 flex items-center justify-between bg-[#fff9f6] shadow-md md:px-14 lg:px-32 xl:px-48 px-5">
          <h1 className="md:text-3xl text-2xl font-bold mb-2 text-[#ff4d2d]">
            SnackSprint
          </h1>

          <div className=" flex items-center gap-2 md:gap-4">
            {/* Add food button */}
            {shopData && (
              <button 
              onClick={()=>{
                navigate("/add-shop-items")
              }}
               className="rounded-full md:rounded-xl bg-[#ff4d2d]/10 text-[#ff4d2d] items-center justify-between md:px-3 md:py-1 p-2 flex gap-1 font-medium cursor-pointer">
              <FiPlusCircle size={20} />
              <span className="hidden md:block">
                {loading ? <ClipLoader size={35} color="white"/> : "Add Food Items"}
              </span>
              </button>
            )}

            {/* Profile */}
            <div
              className="bg-[#ff4d2d] p-2 rounded-full w-[30px] h-[30px] flex items-center justify-center font-semibold shadow-xl text-white text-[18px] cursor-pointer"
              onClick={() => {
                setShowInfo((prev) => !prev);
                setShowSearchInput(false);
              }}
            >
              {userData?.fullname.slice(0, 1)}
            </div>

            {/* Profile popup */}
            {showInfo == true && (
              <div className="fixed w-[200px] md:w-auto top-18 right-4 md:right-[6%] lg:right-[13%] bg-white shadow-2xl rounded-xl px-4 py-4 flex flex-col items-start z-9999 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] text-gray-800 font-semibold truncate">
                    {userData.fullname} | {userData.role.toUpperCase()}
                  </span>
                  <span className="text-[14px] text-gray-800 font-semibold truncate">
                    {userData.email}
                  </span>
                  <span className="text-[14px] text-gray-800 font-semibold truncate">
                    {country.toUpperCase().slice(0, 2)} - {userData.mobile}
                  </span>
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <button
                    className="text-[#993a29] text-[14px] font-semibold cursor-pointer bg-[#ff4d2d]/20 p-1 rounded-md w-full"
                    onClick={handleSignOut}
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default Nav;
