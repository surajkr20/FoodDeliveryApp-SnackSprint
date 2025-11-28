import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "../dashboards/UserDashboard";
import OwnerDashboard from "../dashboards/OwnerDashboard";
import DeliveryboyDashboard from "../dashboards/DeliveryboyDashboard";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  return (
    <div>
      {userData.role == "user" && <UserDashboard />}
      {userData.role == "owner" && <OwnerDashboard />}
      {userData.role == "deliveryboy" && <DeliveryboyDashboard />}
    </div>
  );
};

export default Home;
