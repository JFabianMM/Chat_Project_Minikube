import { createSlice } from "@reduxjs/toolkit";

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: [],
    reducers: {
        updateMessages: (state, action)=>{
            return action.payload
        },
        addMessage: (state, action)=>{
            const {room, index, message} = action.payload;
            const foundMessage = state.find(message => message.room === room);
            if (foundMessage){
                foundMessage.messages = message
            }
        },
        addNewContactMessage: (state, action)=>{
            let currentState=state.concat(action.payload);
            return currentState
        }
    }
})

export const messagesReducer = messagesSlice.reducer
export const {updateMessages, addMessage, addNewContactMessage} = messagesSlice.actions
