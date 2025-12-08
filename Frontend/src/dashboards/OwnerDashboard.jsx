import React from "react";
import Nav from "../components/Nav";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const { shopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center justify-center">
      <Nav />
      {!shopData && (
        <div className="flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg border rounded-2xl border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="w-16 h-16 text-[#ff4d2d] sm:w-20 sm:h-20 mb-4"/>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Add Your Restaurant</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Join our food delivery platform and reach thousands of hungry costumbers everyday.
              </p>
              <button className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer"
                onClick={()=>navigate('/create-edit-shop')}
              >Get Started</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
