import { createSlice } from "@reduxjs/toolkit";

export const searchMessageSlice = createSlice({
    name: 'searchMessage',
    initialState: '',
    reducers: {
        updateSearchMessage: (state, action)=>{
            return action.payload
        }
    }
})

export const searchMessageReducer =  searchMessageSlice.reducer;
export const {updateSearchMessage} = searchMessageSlice.actions;