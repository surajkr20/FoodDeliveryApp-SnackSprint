import React from "react";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { Routes, Route } from "react-router-dom";
import ForgetPassword from "./pages/ForgetPassword";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
