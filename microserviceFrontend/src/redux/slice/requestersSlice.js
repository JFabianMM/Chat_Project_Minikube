import { createSlice } from "@reduxjs/toolkit";

export const requestersSlice = createSlice({
    name: 'requesters',
    initialState: [],
    reducers: {
        updateRequesters: (state, action)=>{
            return action.payload
        }
    }
})

export const {updateRequesters} = requestersSlice.actions
export default requestersSlice.reducer