const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const getGroupNotificationsAvatars=require('../functions/getGroupNotificationsAvatars');
const logger = require("../logger");

const groupNotifications = {
    Query: { 
        async groupNotifications(context,args){
            try{
                let req=context.headers.cookie;
                const token = req.replace('token=','');
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                const formData={identification: authResponse.identification}
                const groupNotification= await fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'groupnotifications');
                const groupNotificationAvatar = await getGroupNotificationsAvatars(groupNotification);
                return groupNotificationAvatar.groupNotifications;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e); 
            }            
        }
    },
};

module.exports = groupNotifications;
        