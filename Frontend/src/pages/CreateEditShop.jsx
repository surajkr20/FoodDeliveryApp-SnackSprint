import React, { useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { setShopData } from "../redux/ownerSlice";

const CreateEditShop = () => {
  const navigate = useNavigate();
  const { shopData } = useSelector((state) => state.owner);
  const { city, state, currentAddress } = useSelector((state) => state.user);
  const [name, setName] = useState(shopData?.name || "");
  const [City, setCity] = useState(shopData?.city || city);
  const [State, setState] = useState(shopData?.state || state);
  const [Address, setAddress] = useState(shopData?.address || currentAddress);
  const [frontendImage, setFrontendImage] = useState(shopData?.image || null);
  const [backendImage, setBackendImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
      formData.append("name", name);
      formData.append("city", City);
      formData.append("state", State);
      formData.append("address", Address);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(setShopData(result.data));
      toast("Shop Created sucessfully..")
      setLoading(false);
      navigate("/");
      console.log(result);
    } catch (error) {
      console.log(`handle submit error`, error);
      setLoading(false);
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
        className="fixed md:top-4 md:left-4 top-1 left-1 text-[#ff4d2d] z-10 mb-2.5 cursor-pointer hover:scale-105 transition-all duration-200"
        onClick={() => navigate("/")}
      >
        <IoArrowBackCircleOutline size={35} />
      </div>

      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-[500px] md:p-8 p-4 flex flex-col items-center justify-center gap-4`}
        style={{ border: `1px solid bg-[#fff9f6]` }}
      >
        {/* logo and heading */}
        <div className="w-full flex flex-col items-center gap-1">
          <FaUtensils className="w-14 h-14 bg-[#ff4d2d]/20 text-[#ff4d2d] rounded-full shadow-lg p-2 border border-gray-300" />
          <h2 className="text-xl font-semibold font-serif">
            {shopData ? "Edit Shop" : "Add Shop"}
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
              htmlFor="shopname"
              classNa
              className="block text-gray-700 font-medium"
            >
              Shop Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              type="text"
              placeholder="Enter your restaurant name here.."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* choose shop image */}
          <div className="w-full flex flex-col items-start gap-1">
            <label
              htmlFor="shopImage"
              classNa
              className="block text-gray-700 font-medium"
            >
              Restaurant Image
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

          {/* shop city and state name */}
          <div className="flex items-center w-full gap-6">
            <div className="flex flex-col items-start gap-1">
              <label
                htmlFor="city"
                classNa
                className="block text-gray-700 font-medium"
              >
                City
              </label>
              <input
                onChange={(e) => setCity(e.target.value)}
                value={City}
                required
                type="text"
                placeholder="Enter city.."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex flex-col items-start gap-1">
              <label
                htmlFor="state"
                classNa
                className="block text-gray-700 font-medium"
              >
                State
              </label>
              <input
                onChange={(e) => setState(e.target.value)}
                value={State}
                required
                type="text"
                placeholder="Enter state.."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* shop address */}
          <div className="w-full flex flex-col items-start gap-1">
            <label
              htmlFor="address"
              classNa
              className="block text-gray-700 font-medium"
            >
              Address
            </label>
            <input
              onChange={(e) => setAddress(e.target.value)}
              required
              value={Address}
              type="text"
              placeholder="Enter your restaurant address"
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

export default CreateEditShop;
