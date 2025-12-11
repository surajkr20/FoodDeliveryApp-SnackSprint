import React, { use, useState } from "react";
import { IoKeyOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { serverUrl } from "../App";
import axios from "axios";
import {ClipLoader} from "react-spinners"
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        {
          withCredentials: true,
        }
      );
      setLoading(false);
      toast("otp sent successfull, check your email!")
      setStep(2);
      console.log(result);
      setErr("");
    } catch (error) {
      console.log("handleSendOtp error : ", error);
      setErr(error.response.data.message);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        {
          withCredentials: true,
        }
      );
      setStep(3);
      toast("otp verified successfully..")
      console.log(result);
      setLoading(false)
      setErr("");
    } catch (error) {
      console.log("handleSendOtp error : ", error);
      setErr(error.response.data.message);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    if (newPassword != confirmPassword) {
      setErr("password miss matched!")
      return null;
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword },
        {
          withCredentials: true,
        }
      );
      navigate("/signin");
      toast("password updated successfully..")
      console.log(result);
      setLoading(false);
      setErr("");
    } catch (error) {
      console.log("handleSendOtp error : ", error);
      setErr(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-[#fff9f6]">
      <div className="flex flex-col gap-3 bg-white max-w-md rounded-xl shadow-lg p-8 border border-gray-300">
        {/* key logo, heading and subheadings */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center justify-center border border-gray-300 py-3 px-3 rounded-xl">
            {step == 1 && <IoKeyOutline size={30} />}
            {step == 2 && <CiMail size={30} />}
            {step == 3 && <CiLock size={30} />}
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl text-center font-medium font-serif text-red-400">
              Forget Password?
            </h1>
            <p className="text-center text-gray-500">
              {step == 1 &&
                "Enter your registered email, we'll sent a password reset OTP to your email."}
              {step == 2 &&
                "Check your email we'll send an OTP, and verify now."}
              {step == 3 &&
                "Your new password must be diffrent to previously used passwords."}
            </p>
          </div>
        </div>

        {/* step-1 > send otp on email */}
        {step == 1 && (
          <div>
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

            <p className="text-gray-600 mt-2 mb-2 text-right text-[15px]">
              {err ? err : ""}
            </p>

            {/* reset password button */}
            <button disabled={loading}
              className={`mb-4 w-full rounded-md py-1.5 bg-[#e64323] text-white font-medium cursor-pointer`}
              onClick={() => {
                if (email) {
                  handleSendOtp();
                } else {
                  setErr("email is required");
                }
              }}
            >
              {loading ? <ClipLoader size={20} color="white"/> : "Send OTP"}
            </button>
          </div>
        )}

        {/* step-2 verify otp */}
        {step == 2 && (
          <div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                OTP
              </label>
              <input
                type="text"
                value={otp}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Enter your OTP"
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <p className="text-gray-600 mt-2 mb-2 text-right text-[15px]">
              {err ? err : ""}
            </p>

            {/* reset password button */}
            <button disabled={loading}
              className={`mb-4 w-full rounded-md py-1.5 bg-[#e64323] text-white font-medium cursor-pointer`}
              onClick={() => {
                if (otp) {
                  handleVerifyOtp();
                } else {
                  setErr("otp not sent!");
                }
              }}
            >
              {loading ? <ClipLoader size={20} color="white"/> : "verify otp"}
            </button>
          </div>
        )}

        {step == 3 && (
          <div>
            <div className="mb-4">
              <label
                htmlFor="newpassword"
                className="block text-gray-700 font-medium mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
                  placeholder="Enter your new password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-gray-600 cursor-pointer"
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmpassword"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-500"
                  placeholder="confirm your password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-gray-600 cursor-pointer"
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>

            <p className="text-gray-600 mt-2 mb-2 text-right text-[15px]">
              {err ? err : ""}
            </p>

            {/* reset password button */}
            <button disabled={loading}
              className={`mb-4 w-full rounded-md py-1.5 bg-[#e64323] text-white font-medium cursor-pointer`}
              onClick={()=>{
                if(newPassword && confirmPassword){
                  handleResetPassword();
                }else{
                  setErr("All fields are required!")
                }
              }}
            >
              {loading ? <ClipLoader size={20} color="white"/> : "Reset password"}
            </button>
          </div>
        )}

        {/* back to login */}
        <div
          className="flex items-center justify-between"
          onClick={() => {
            if (step <= 1) {
              setStep(1);
            } else {
              setStep(step - 1);
            }
          }}
        >
          <div className="flex items-center justify-center gap-2 cursor-pointer">
            <GoArrowLeft />
            <h2 className="text-gray-800">Previous Page</h2>
          </div>
          <div className="flex items-center justify-center gap-2 cursor-pointer">
            <h2 className="text-gray-800" onClick={() => navigate("/signin")}>
              Back to login
            </h2>
            <FaRegArrowAltCircleRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
