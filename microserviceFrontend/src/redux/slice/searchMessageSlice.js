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

export const {updateSearchMessage} = searchMessageSlice.actions
export default searchMessageSlice.reducer