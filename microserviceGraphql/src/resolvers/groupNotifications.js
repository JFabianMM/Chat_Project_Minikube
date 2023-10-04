const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchGetFunction = require('../functions/fetchGetFunction');
const getGroupNotificationsAvatars=require('../functions/getGroupNotificationsAvatars');
const logger = require("../logger");
const validationFunction = require('../functions/validationFunction');

const groupNotifications = {
    Query: { 
        async groupNotifications(context,args){
            try{
                const authResponse = await validationFunction(context.headers.cookie); 
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                const url = new URL(process.env.BACKEND_MICROSERVICE+'groupnotifications');
                url.searchParams.set('identification', authResponse.identification);
                const groupNotification= await fetchGetFunction(url.href);
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
        