import { createSlice } from "@reduxjs/toolkit";

export const languageSlice = createSlice({
    name: 'language',
    initialState: 'en',
    reducers: {
        updateLanguage: (state, action)=>{
            return action.payload
        }
    }
})

export const languageReducer = languageSlice.reducer
export const {updateLanguage} = languageSlice.actions
