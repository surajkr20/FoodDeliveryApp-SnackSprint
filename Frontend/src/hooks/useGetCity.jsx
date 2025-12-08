import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCity, setCountry, setState, setCurrentAddress } from "../redux/userSlice";

function useGetCity() {
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEOLOCATION_APIKEY;
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lattitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lattitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
      );
      // console.log(result)
      dispatch(setCity(result?.data?.results[0].city));
      dispatch(setCountry(result?.data?.results[0].country));
      dispatch(setState(result?.data?.results[0].state));
      dispatch(setCurrentAddress(result?.data?.results[0].address_line2))
    });
  }, [userData]);
}

export default useGetCity;
