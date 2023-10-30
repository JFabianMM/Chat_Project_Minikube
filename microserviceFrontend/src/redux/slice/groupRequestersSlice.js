import { createSlice } from "@reduxjs/toolkit";

export const groupRequestersSlice = createSlice({
    name: 'groupRequesters',
    initialState: [],
    reducers: {
        updateGroupRequesters: (state, action)=>{
            return action.payload
        }
    }
})

export const groupRequestersReducer = groupRequestersSlice.reducer
export const {updateGroupRequesters} = groupRequestersSlice.actions
