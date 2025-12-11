import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import {serverUrl} from "../App";
import { setShopData } from "../redux/ownerSlice";
import {toast} from "react-toastify"

const ShowFoodItems = ({ data }) => {
  const { shopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleDelete = async ()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/item/delete-item/${data._id}`, {
        withCredentials: true
      })
      dispatch(setShopData(result.data));
      toast("Food-Item deleted successfull.")
      console.log("result",result);
    } catch (error) {
      console.log("delete food item error", error)
    }
  }

  return (
    <div
      className="w-full bg-white rounded-xl shadow-2xl p-3.5 border border-[#fff9f6] flex flex-col gap-3"
      style={{ border: `1px solid bg-[#fff9f6]` }}
    >
      {/* restaurant banner image */}
      <div className="w-full">
        <div className="w-full bg-amber-200">
          <img
            src={data.image}
            alt="foodimage"
            className="object-fill md:h-[150px] h-[100px] w-full rounded-xl"
          />
        </div>
      </div>

      {/* food details */}
      <div className="w-full flex flex-col items-start font-serif relative">
        <div className="flex flex-col items-center absolute right-0 top-4.5 gap-2">
          <MdEdit
            size={25}
            className="bg-green-600 rounded-full p-1 text-white cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => navigate(`/edit-shop-items/${data._id}`)}
          />
          <MdDelete
            size={25}
            className="bg-[#ff4d2d] rounded-full p-1 text-white cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={handleDelete}
          />
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold text-[#ff4d2d] font-serif">
          {data.name}
        </h2>

        <p className="text-sm text-gray-700">Category : {data.category}</p>
        <p className="text-sm text-gray-700">FoodType : {data.foodtype}</p>
        <p className="text-sm text-gray-700 flex">
          <span>Price : </span>
          <span className="flex items-center">
            <FaRupeeSign />
            {data.price}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ShowFoodItems;
