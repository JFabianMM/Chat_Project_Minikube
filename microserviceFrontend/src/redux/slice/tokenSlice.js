import { createSlice } from "@reduxjs/toolkit";
import { setCookie } from "../../app/functions/setCookie";

export const tokenSlice = createSlice({
    name: 'token',
    initialState: '',
    reducers: {
        updateToken: (state, action)=>{
            setCookie("token", action.payload, 1);
            return action.payload
        }
    }
})

export const tokenReducer = tokenSlice.reducer;
export const {updateToken} = tokenSlice.actions;
