const { makeExecutableSchema}= require('@graphql-tools/schema');
const { merge } =require('lodash');

const typeDefs = require('./typeDefs/typeDefs');

const contacts = require('./resolvers/contacts');
const createContact = require('./resolvers/createContact');
const createGroup = require('./resolvers/createGroup');
const createGroupAndNotifications = require('./resolvers/createGroupAndNotifications');
const createNewMessage = require('./resolvers/createNewMessage');
const createNewStatus = require('./resolvers/createNewStatus');
const createNotification = require('./resolvers/createNotification');
const createUser = require('./resolvers/createUser');
const deleteGroupNotification = require('./resolvers/deleteGroupNotification');
const deleteNotification = require('./resolvers/deleteNotification');
const groupNotifications = require('./resolvers/groupNotifications');
const groups = require('./resolvers/groups');
const login = require('./resolvers/login');
const notification = require('./resolvers/notification');
const singleUpload = require('./resolvers/singleUpload');
const tokenLogin = require('./resolvers/tokenLogin');
const updateUserData = require('./resolvers/updateUserData');
const user = require('./resolvers/user');

const schema= makeExecutableSchema({
    typeDefs: [typeDefs],
    resolvers: merge(contacts,createContact,createGroup,createGroupAndNotifications,createNewMessage,createNewStatus,createNotification,createUser,deleteGroupNotification,deleteNotification,groupNotifications,groups,login,notification,singleUpload,tokenLogin,updateUserData,user),
});


module.exports = schema;