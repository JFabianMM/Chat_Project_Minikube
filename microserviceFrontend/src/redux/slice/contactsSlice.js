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

export const {updateContacts} = contactsSlice.actions
export default contactsSlice.reducer