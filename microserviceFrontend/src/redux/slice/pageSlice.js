import { createSlice } from "@reduxjs/toolkit";

export const pageSlice = createSlice({
    name: 'page',
    initialState: '',
    reducers: {
        updatePage: (state, action)=>{
            return action.payload
        }
    }
})

export const {updatePage} = pageSlice.actions
export default pageSlice.reducer