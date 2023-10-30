import { createSlice } from "@reduxjs/toolkit";

export const currentChatSlice = createSlice({
    name: 'currentChat',
    initialState: [],
    reducers: {
        updateCurrentChat: (state, action)=>{
            return action.payload
        }
    }
})

export const currentChatReducer = currentChatSlice.reducer
export const {updateCurrentChat} = currentChatSlice.actions
