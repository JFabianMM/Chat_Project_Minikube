import { createSlice } from "@reduxjs/toolkit";

export const groupsSlice = createSlice({
    name: 'groups',
    initialState: [],
    reducers: {
        updateGroups: (state, action)=>{
            return action.payload
        }
    }
})

export const {updateGroups} = groupsSlice.actions
export default groupsSlice.reducer