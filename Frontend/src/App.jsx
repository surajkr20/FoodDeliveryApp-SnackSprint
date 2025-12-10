import React from "react";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { Routes, Route, Navigate } from "react-router-dom";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";
import CreateEditShop from "./pages/CreateEditShop";
import AddFoodItems from "./pages/AddFoodItems";
import EditFoodItems from "./pages/EditFoodItems";

export const serverUrl = "http://localhost:3000";

const App = () => {
  useGetCurrentUser();
  useGetCity();
  useGetMyShop()
  const { userData, city} = useSelector(state=>state.user);
  const { shopData } = useSelector(state=>state.owner);

  return (
    <div>
      <Routes>
        <Route path="/" element={userData ? <Home /> : <Navigate to={'/signin'}/>} />
        <Route path="/signup" element={!userData ? <SignUp />: <Navigate to={'/'}/>} />
        <Route path="/signin" element={!userData ? <SignIn />: <Navigate to={'/'}/>} />
        <Route path="/forget-password" element={!userData ? <ForgetPassword />: <Navigate to={'/'}/>} />
        <Route path="/create-edit-shop" element={userData ? <CreateEditShop /> : <Navigate to={'/signin'}/>} />
        <Route path="/add-shop-items" element={userData && shopData ? <AddFoodItems /> : <Navigate to={'/signin'}/>} />
        <Route path="/edit-shop-items/:itemId" element={userData && shopData && shopData?.items.length > 0 ? <EditFoodItems /> : <Navigate to={'/signin'}/>} />
      </Routes>
    </div>
  );
};

export default App;
