import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        city: null,
        country: null,
    },
    reducers: {
        setUserData : (state, action)=>{
            state.userData = action.payload;
        },
        setCity: (state, action)=>{
            state.city = action.payload;
        },
        setCountry: (state, action)=>{
            state.country = action.payload;
        }
    }
})

export const { setUserData, setCity, setCountry } = userSlice.actions;
export default userSlice.reducer;