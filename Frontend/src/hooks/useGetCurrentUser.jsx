import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";

function useGetCurrentUser() {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        console.log("getting current user: ", data);
      } catch (error) {
        console.log("getting error in current user: ", error)
      }
    };
    fetchUser();
  }, []);
}

export default useGetCurrentUser;
