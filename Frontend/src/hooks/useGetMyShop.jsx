import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setShopData } from "../redux/ownerSlice.js";

function useGetMyShop() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-shop`, {
          withCredentials: true,
        });
        console.log("shopData", result);
        dispatch(setShopData(result.data));
      } catch (error) {
        console.log("getting error in current shop: ", error);
      }
    };
    fetchShop();
  }, []);
}

export default useGetMyShop;
