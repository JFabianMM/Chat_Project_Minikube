import { createSlice } from "@reduxjs/toolkit";

export const avatarSlice = createSlice({
    name: 'avatar',
    initialState: {},
    reducers: {
        updateAvatar: (state, action)=>{
            return action.payload
        }
    }
})

export const avatarReducer = avatarSlice.reducer
export const {updateAvatar} = avatarSlice.actions
