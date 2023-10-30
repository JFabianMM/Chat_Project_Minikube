const contacts = require('./contacts');
const createContact = require('./createContact');
const createGroup = require('./createGroup');
const createGroupAndNotifications = require('./createGroupAndNotifications');
const createNotification = require('./createNotification');
const createUser = require('./createUser');
const deleteContact = require('./deleteContact');
const deleteGroupNotification = require('./deleteGroupNotification');
const deleteNotification= require('./deleteNotification');
const editGroup = require('./editGroup');
const groupNotifications = require('./groupNotifications');
const groups = require('./groups');
const leaveGroup = require('./leaveGroup');
const login = require('./login');
const newLanguage = require('./newLanguage');
const newMessage = require('./newMessage');
const newStatus = require('./newStatus');
const notification = require('./notification');
const singleUpload = require('./singleUpload');
const tokenLogin = require('./tokenLogin');
const updateUserData = require('./updateUserData');
const user = require('./user');

module.exports = {
    contacts,
    createContact,
    createGroup,
    createGroupAndNotifications,
    createNotification,
    createUser,
    deleteContact,
    deleteGroupNotification,
    deleteNotification,
    editGroup,
    groupNotifications,
    groups,
    leaveGroup,
    login,
    newLanguage,
    newMessage,
    newStatus,
    notification,
    singleUpload,
    tokenLogin,
    updateUserData,
    user
};