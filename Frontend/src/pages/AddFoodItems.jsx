import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { setShopData } from "../redux/ownerSlice";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";

const AddFoodItems = () => {
  const { shopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");

  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const categories = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast Food",
    "Others",
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", itemName);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("foodtype", foodType);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/item/create-item`,
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(setShopData(result.data));
      toast("Your Food-item Added sucessfully..")
      setLoading(false);
      navigate("/");
      console.log(result);
    } catch (error) {
      setLoading(false);
      console.log("handleSubmit in the foodItems error".error);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <ClipLoader size={35} color="black" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-br from-orange-50 to-white">
      <div
        className="fixed md:top-4 md:left-4 top-1 left-1 text-[#ff4d2d] mb-2.5 cursor-pointer hover:scale-105 transition-all duration-200"
        onClick={() => navigate("/")}
      >
        <IoArrowBackCircleOutline size={35} />
      </div>

      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-[500px] md:p-8 p-3 flex flex-col items-center justify-center gap-4`}
        style={{ border: `1px solid bg-[#fff9f6]` }}
      >
        {/* logo and heading */}
        <div className="w-full flex flex-col items-center gap-1">
          <FaUtensils className="w-14 h-14 bg-[#ff4d2d]/20 text-[#ff4d2d] rounded-full shadow-lg p-2 border border-gray-300" />
          <h2 className="text-xl font-semibold font-serif">
            Add your food-items
          </h2>
        </div>

        {/* form for shop information */}
        <form
          className="flex flex-col items-center gap-4 w-full"
          onSubmit={handleSubmit}
        >
          {/* shop name */}
          <div className="w-full flex flex-col items-start gap-1">
            <label
              htmlFor="item-name"
              classNa
              className="block text-gray-700 font-medium"
            >
              Food Item Name
            </label>
            <input
              onChange={(e) => setItemName(e.target.value)}
              value={itemName}
              required
              type="text"
              placeholder="Enter your food-item name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* choose shop image */}
          <div className="w-full flex flex-col items-start gap-1">
            <label
              htmlFor="food-image"
              classNa
              className="block text-gray-700 font-medium"
            >
              Food Image
            </label>
            <input
              onChange={handleImage}
              type="file"
              required
              accept="image/*"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
            />
            {frontendImage && (
              <div className="flex items-center justify-center mt-1.5 p-1">
                <img
                  src={frontendImage}
                  alt="shop-image"
                  className="rounded-2xl border"
                />
              </div>
            )}
          </div>

          {/* food category */}
          <div className="w-full flex flex-col items-start gap-1">
            <label
              htmlFor="item-name"
              classNa
              className="block text-gray-700 font-medium"
            >
              Select Category
            </label>

            <select
              name="food-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              id="category"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat, idx) => (
                <option value={cat} key={idx}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Food type */}
          <div className="w-full flex flex-col items-start gap-1">
            <label
              htmlFor="item-name"
              classNa
              className="block text-gray-700 font-medium"
            >
              Select food-type
            </label>

            <select
              name="food-type"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              id="foodtype"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
            >
              <option value="veg">veg</option>
              <option value="non veg">Non-Veg</option>
            </select>
          </div>

          {/* price */}
          <div className="w-full flex flex-col items-start gap-1">
            <label
              htmlFor="price"
              classNa
              className="block text-gray-700 font-medium"
            >
              Price
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
              type="number"
              placeholder="Enter your food-item price"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* submit button */}
          <button
            className={`mb-4 w-full rounded-md py-1.5 hover:bg-[#e64323] bg-[#ff4d2d] text-white font-medium cursor-pointer`}
          >
            {loading ? <ClipLoader size={25} color="white" /> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFoodItems;
