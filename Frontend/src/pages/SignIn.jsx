import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

const SignIn = () => {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const nevigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        {
          withCredentials: true,
        }
      );
      console.log("result data from signin: ", result);
      // reset input fields
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("signup error from fetching signup api", error);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border`}
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1
          className={`text-3xl font-bold mb-2`}
          style={{ color: primaryColor }}
        >
          SnackSprint
        </h1>
        <p className="text-gray-600 mb-8">
          Create your accout to get started with delicious food deliveries
        </p>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="text"
            required
            value={email}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-600 cursor-pointer"
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>

        <div className={`text-right font-medium text-[#ff4d2d] mb-2 cursor-pointer`}
          onClick={()=>nevigate("/forget-password")}
        >
          Forget password
        </div>

        <button
          className={`mb-4 w-full rounded-md py-1.5 hover:bg-[#e64323] bg-[#ff4d2d] text-white font-medium cursor-pointer`}
          onClick={handleSignIn}
        >
          Sign in
        </button>

        <button
          className={`mt-2 w-full rounded-md cursor-pointer flex items-center justify-center gap-2 border 
            py-1.5 border-gray-300 shadow transition duration-200 hover:bg-gray-200 font-serif`}
        >
          <FcGoogle size={18} />
          <span>Sign In with google</span>
        </button>

        <p className="mt-2 text-center">
          want to create new account ?{" "}
          <Link to={"/signup"}>
            <span className="text-blue-600">Signup Now</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
