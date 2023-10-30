import { createSlice } from "@reduxjs/toolkit";

export const currentRoomSlice = createSlice({
    name: 'currentRoom',
    initialState: [],
    reducers: {
        updateCurrentRoom: (state, action)=>{
            return action.payload
        }
    }
})

export const currentRoomReducer = currentRoomSlice.reducer
export const {updateCurrentRoom} = currentRoomSlice.actions
