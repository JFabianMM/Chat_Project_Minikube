import { createSlice } from "@reduxjs/toolkit";

export const errorNotificationSlice = createSlice({
    name: 'errorNotification',
    initialState: '',
    reducers: {
        updateErrorNotification: (state, action)=>{
            return action.payload
        }
    }
})

export const errorNotificationReducer = errorNotificationSlice.reducer
export const {updateErrorNotification} = errorNotificationSlice.actions
