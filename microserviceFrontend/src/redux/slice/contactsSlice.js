import { createSlice } from "@reduxjs/toolkit";

export const contactsSlice = createSlice({
    name: 'contacts',
    initialState: [],
    reducers: {
        updateContacts: (state, action)=>{
            return action.payload
        }
    }
})

export const contactsReducer = contactsSlice.reducer
export const {updateContacts} = contactsSlice.actions
