import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        city: null,
        country: null,
        state: null,
        currentAddress: null
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
        },
        setState: (state, action) =>{
            state.state = action.payload;
        },
        setCurrentAddress: (state, action) =>{
            state.currentAddress = action.payload;
        }
    }
})

export const { setUserData, setCity, setCountry, setState, setCurrentAddress } = userSlice.actions;
export default userSlice.reducer;