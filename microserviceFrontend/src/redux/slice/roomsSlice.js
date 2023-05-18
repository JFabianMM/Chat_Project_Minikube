import { createSlice } from "@reduxjs/toolkit";

export const roomsSlice = createSlice({
    name: 'rooms',
    initialState: [],
    reducers: {
        updateRooms: (state, action)=>{
            return action.payload
        },
        addRooms: (state, action)=>{
            return state.concat(action.payload)
        }
    }
})

export const {updateRooms,addRooms} = roomsSlice.actions
export default roomsSlice.reducer