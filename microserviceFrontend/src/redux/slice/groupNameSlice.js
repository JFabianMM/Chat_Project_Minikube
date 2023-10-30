import { createSlice } from "@reduxjs/toolkit";

export const groupNameSlice = createSlice({
    name: 'groupName',
    initialState: '',
    reducers: {
        updateGroupName: (state, action)=>{
            return action.payload
        }
    }
})

export const groupNameReducer = groupNameSlice.reducer
export const {updateGroupName} = groupNameSlice.actions
