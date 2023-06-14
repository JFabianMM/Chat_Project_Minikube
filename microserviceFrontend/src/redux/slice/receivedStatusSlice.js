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

export const {updateReceivedStatus} = receivedStatusSlice.actions
export default receivedStatusSlice.reducer