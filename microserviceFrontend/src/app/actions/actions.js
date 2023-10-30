import { QUERY_USER, MUTATION_CREATE_NOTIFICATION, CREATE_GROUP_NOTIFICATION, QUERY_GROUP_NOTIFICATION, QUERY_CONTACT, QUERY_GROUPS, EDIT_GROUP, NEW_STATUS, NEW_MESSAGE, NEW_LANGUAGE, QUERY_NOTIFICATION, DELETE_CONTACT, LEAVE_GROUP, CREATE_GROUP, DELETE_GROUP_NOTIFICATION, CREATE_CONTACT, DELETE_NOTIFICATION, UPLOAD, MUTATION_UPDATE_USER_DATA, QUERY_LOGIN, QUERY_TOKEN_LOGIN, MUTATION_SIGNUP, GET_USER_UPDATE } from "../actionTypes/actionTypes"

export const userRequest = function (email) {
    return {type: QUERY_USER, email}
}
export const createNotification = function (id) {
    return {type: MUTATION_CREATE_NOTIFICATION, id}
} 
export const createGroupNotification = function (input, name) {
    return {type: CREATE_GROUP_NOTIFICATION, input, name}
}
export const queryGroupNotification = function () {
    return {type: QUERY_GROUP_NOTIFICATION}
}
export const queryContact = function () {
    return {type: QUERY_CONTACT}
}
export const queryGroups = function () {
    return {type: QUERY_GROUPS}
}
export const editGroup = function (room, input, name) {
    return {type: EDIT_GROUP, room,input,name}
}
export const newStatus = function (id, room, status) {
    return {type: NEW_STATUS, id,room,status}
}
export const newMessage = function (room, inputmessage) {
    return {type: NEW_MESSAGE, room, inputmessage}
}
export const newLanguage = function (language) {
    return {type: NEW_LANGUAGE, language}
}
export const queryNotification = function () {
    return {type: QUERY_NOTIFICATION}
}
export const deleteContact = function (contactid, room) {
    return {type: DELETE_CONTACT, contactid, room}
}
export const leaveGroup = function (room, input) {
    return {type: LEAVE_GROUP, room, input}
}
export const createGroup = function (room, input, name) {
    return {type: CREATE_GROUP, room, input, name}
}
export const deleteGroupNotification = function (room, input, name) {
    return {type: DELETE_GROUP_NOTIFICATION, room, input, name}
}
export const createContact = function (contactid, room) {
    return {type: CREATE_CONTACT, contactid, room}
}
export const deleteNotification = function (contactid, room) {
    return {type: DELETE_NOTIFICATION, contactid, room}
}
export const uploadFile = function (file) {
    return {type: UPLOAD, file}
}
export const updateUserData = function (password, firstName, lastName) {
    return {type: MUTATION_UPDATE_USER_DATA, password, firstName, lastName}
}
export const queryLogin = function (email, password) {
    return {type: QUERY_LOGIN, email, password}
}
export const mutationSignUp = function (email, password, firstName, lastName) {
    return {type: MUTATION_SIGNUP, email, password, firstName, lastName}
}
export const queryTokenLogin = function () {
    return {type: QUERY_TOKEN_LOGIN}
}
export const getUserUpdate = function (data) {
    return {type: GET_USER_UPDATE, data}
}

