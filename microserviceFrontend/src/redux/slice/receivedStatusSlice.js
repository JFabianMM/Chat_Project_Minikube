import { createSlice } from "@reduxjs/toolkit";

export const receivedStatusSlice = createSlice({
    name: 'receivedStatus',
    initialState: '',
    reducers: {
        updateReceivedStatus: (state, action)=>{
            return action.payload
        }
    }
})

export const receivedStatusReducer = receivedStatusSlice.reducer
export const {updateReceivedStatus} = receivedStatusSlice.actions
