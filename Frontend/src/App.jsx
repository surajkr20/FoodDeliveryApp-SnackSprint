import React from "react";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { Routes, Route } from "react-router-dom";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";

export const serverUrl = "http://localhost:3000";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
