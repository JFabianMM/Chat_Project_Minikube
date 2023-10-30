import { createSlice } from "@reduxjs/toolkit";

export const fileSlice = createSlice({
    name: 'file',
    initialState: {},
    reducers: {
        updateFile: (state, action)=>{
            return action.payload
        }
    }
})

export const fileReducer = fileSlice.reducer
export const {updateFile} = fileSlice.actions
