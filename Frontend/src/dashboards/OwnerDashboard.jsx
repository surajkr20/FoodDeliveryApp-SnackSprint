import React, { useState } from "react";
import Nav from "../components/Nav";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import ShowFoodItems from "../components/ShowFoodItems";
import { ClipLoader } from "react-spinners";

const OwnerDashboard = () => {
  const { shopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <ClipLoader size={35} color="black" />
      </div>
    );
  }

  return (
    <div className="w-full pt-[68px] min-h-screen bg-[#fff9f6] flex flex-col items-center">
      <Nav />

      {/* when shop is not created than show */}
      {!shopData && (
        <div className="flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg border rounded-2xl border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="w-16 h-16 text-[#ff4d2d] sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Restaurant
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Join our food delivery platform and reach thousands of hungry
                costumbers everyday.
              </p>
              <button
                className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer"
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* shop is already created than show */}
      {shopData && (
        <div className="w-full flex flex-col items-center md:gap-2 gap-1 mt-2 md:px-14 lg:px-32 xl:px-48 px-3">
          {/* shop image and details */}
          <div
            className={`w-full bg-white rounded-xl shadow-2xl p-3.5 flex flex-col items-center justify-center gap-2`}
            style={{ border: `1px solid bg-[#fff9f6]` }}
          >
            {/* restaurant banner image */}
            <div className="w-full relative">
              <MdEdit
                size={35}
                className="bg-[#ff4d2d] rounded-full p-2 absolute top-3 right-3 text-white cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => navigate("/create-edit-shop")}
              />
              <div className="w-full bg-amber-200">
                <img
                  src={shopData.image}
                  alt="shop-image"
                  className="object-fill md:h-[200px] h-[150px] w-full rounded-xl"
                />
              </div>

              {/* logo and heading
              <div className="flex items-center justify-start gap-2 absolute bottom-0.5 md:left-[23%] left-4 bg-white rounded-md px-2.5 py-1">
                <div
                  className="w-10 h-10 md:block hidden bg-[#ff4d2d] rounded-full border border-gray-300 cursor-pointer shadow-2xl duration-200 transition-all hover:scale-105"
                >
                  <FaUtensils size={40} className=" p-2 rounded-full" />
                </div>
                <h2 className="md:text-xl text-[14px] font-semibold font-serif text-gray-700">
                  WELCOME TO {shopData.name.toUpperCase()}
                </h2>
              </div> */}
            </div>

            {/* restaurant details */}
            <div className="w-full flex md:flex-row flex-col items-center font-serif justify-evenly md:gap-1">
              <p className="text-sm text-gray-700">
                Restaurant Owner : {shopData.owner.fullname}
              </p>

              <h2 className="text-sm md:text-xl font-semibold font-serif text-gray-700">
                WELCOME TO {shopData.name.toUpperCase()}
              </h2>

              <p className="text-sm text-gray-700">
                Address : {shopData.address}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* if shop food items is not created */}
      {shopData?.items.length == 0 && (
        <div className="flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg border rounded-2xl border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="w-16 h-16 text-[#ff4d2d] sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Food Items
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Join our food delivery platform and reach thousands of hungry
                costumbers everyday.
              </p>
              <button
                className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer"
                onClick={() => navigate("/add-shop-items")}
              >
                Add Food
              </button>
            </div>
          </div>
        </div>
      )}

      {/* if shop food items is available than show this div */}
      {shopData?.items.length > 0 && (
        <div className="w-full grid md:grid-cols-2 grid-cols-1 mt-2 gap-2 md:px-14 lg:px-32 xl:px-48 px-3 mb-4">
          {shopData.items.map((item, idx) => (
            <ShowFoodItems key={idx} data={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
