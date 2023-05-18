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

export const {updateAvatar} = avatarSlice.actions
export default avatarSlice.reducer