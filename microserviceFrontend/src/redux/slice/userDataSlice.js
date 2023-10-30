import { createSlice } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
    name: 'userData',
    initialState: '',
    reducers: {
        updateUserData: (state, action)=>{
            return action.payload
        }
    }
})

export const userDataReducer =  userDataSlice.reducer
export const {updateUserData} = userDataSlice.actions
