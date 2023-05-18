import { createSlice } from "@reduxjs/toolkit";

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: 0,
    reducers: {
        updateNotifications: (state, action)=>{
            return action.payload
        }
    }
})

export const {updateNotifications} = notificationsSlice.actions
export default notificationsSlice.reducer