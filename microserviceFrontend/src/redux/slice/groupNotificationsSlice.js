import { createSlice } from "@reduxjs/toolkit";

export const groupNotificationsSlice = createSlice({
    name: 'groupNotifications',
    initialState: 0,
    reducers: {
        updateGroupNotifications: (state, action)=>{
            return action.payload
        },
        eliminateGroupNotification: (state, action)=>{
            return state-1
        }
    }
})

export const groupNotificationsReducer = groupNotificationsSlice.reducer
export const {updateGroupNotifications, eliminateGroupNotification} = groupNotificationsSlice.actions
