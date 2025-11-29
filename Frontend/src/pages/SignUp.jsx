import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const SignUp = () => {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [err, setErr] = useState("");

  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignup = async () => {
    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullname, email, password, mobile, role },
        {
          withCredentials: true,
        }
      );
      dispatch(setUserData(result.data))
      setErr("");
      setLoading(false);
      // reset input fields
      setFullname("");
      setEmail("");
      setPassword("");
      setMobile("");
      setRole("");
    } catch (error) {
      console.log("signup error from fetching signup api", error);
      setErr(error.response.data.message);
      setLoading(false)
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    if (!mobile) {
      return setErr("mobile number is required!");
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const {data} = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullname: result.user.displayName,
          email: result.user.email,
          role,
          mobile,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data))
      setLoading(false);
      setErr("");
    } catch (error) {
      console.log("google auth error: ", error);
      setErr(error.response.data.message);
      setLoading(false);
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
        <p className="text-gray-600 mb-4">
          Create your accout to get started with delicious food deliveries
        </p>

        {/* Full Name */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-medium mb-1"
          >
            FullName
          </label>
          <input
            type="text"
            value={fullname}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your fullname"
            onChange={(e) => {
              setFullname(e.target.value);
            }}
          />
        </div>

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
            value={email}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block text-gray-700 font-medium mb-1"
          >
            Mobile Number
          </label>
          <input
            type="text"
            value={mobile}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your mobile number"
            onChange={(e) => setMobile(e.target.value)}
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
              value={password}
              required
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

        {/* Role */}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-1"
          >
            Role
          </label>

          <div className="flex items-center justify-between w-full">
            {["user", "owner", "deliveryboy"].map((r) => (
              <button
                key={r}
                className="border rounded-md px-4 md:px-8 py-1.5 cursor-pointer text-center font-medium transition-colors"
                onClick={() => setRole(r)}
                style={
                  role == r
                    ? { backgroundColor: primaryColor, color: "white" }
                    : { border: `1px solid ${primaryColor}`, color: "#333" }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <p className="text-gray-600 mt-2 mb-2 text-right text-[15px]">
          {err ? err : ""}
        </p>

        {/* signup button */}
        <button disabled={loading}
          className={`mb-4 w-full rounded-md py-1.5 hover:bg-[#e64323] bg-[#ff4d2d] text-white font-medium cursor-pointer`}
          onClick={() => {
            if (fullname && email && password && role && mobile) {
              handleSignup();
            } else {
              setErr("all fields are required!");
            }
          }}
        >
          {loading? <ClipLoader size={20} color="white"/> : "Signup"}
        </button>

        {/* signup with google button */}
        <button
          className={`mt-2 w-full rounded-md cursor-pointer flex items-center justify-center gap-2 border 
            py-1.5 border-gray-300 shadow transition duration-200 hover:bg-gray-200 font-serif`}
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={18} />
          <span>Sign Up with google</span>
        </button>

        <p className="mt-2 text-center">
          Already have an account ?{" "}
          <Link to={"/signin"}>
            <span className="text-blue-600">Signin</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
