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

export const {updateGroupName} = groupNameSlice.actions
export default groupNameSlice.reducer