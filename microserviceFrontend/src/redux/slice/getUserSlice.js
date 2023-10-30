import { createSlice } from "@reduxjs/toolkit";

function getUserSlice(state = '', action) {
    switch (action.type) {
      case 'GET_USER_UPDATE':
        return action.data.user
      default:
        return state
    }
  }

export const getUserReducer = getUserSlice  