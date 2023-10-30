const { makeExecutableSchema}= require('@graphql-tools/schema');
const { merge } =require('lodash');

const typeDefs = require('./typeDefs/typeDefs');

const { contacts,  createContact, createGroup,createGroupAndNotifications,createNotification,createUser,deleteContact,deleteGroupNotification,deleteNotification,editGroup,groupNotifications,groups,leaveGroup,login,newLanguage,newMessage,newStatus,notification,singleUpload,tokenLogin,updateUserData,user} = require('./resolvers'); 

const schema= makeExecutableSchema({
    typeDefs: [typeDefs],
    resolvers: merge(contacts,createContact,createGroup,editGroup,leaveGroup,createGroupAndNotifications,newMessage,newLanguage, newStatus,createNotification,createUser,deleteGroupNotification,deleteNotification,deleteContact,groupNotifications,groups,login,notification,singleUpload,tokenLogin,updateUserData,user),
});


module.exports = schema;