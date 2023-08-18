const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const fetchGetFunction = require('../functions/fetchGetFunction');
const getNotificationsAvatars= require('../functions/getNotificationsAvatars');
const logger = require("../logger");

const notification = {
    Query: { 
        async notification(context, args){ 
            try{
                let req=context.headers.cookie;
                const token = req.replace('token=','');
                const authFormData={token};
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 

                const url = new URL(process.env.BACKEND_MICROSERVICE+'notification');
                url.searchParams.set('identification', authResponse.identification);
                const notification= await fetchGetFunction(url.href);
                const notificationAvatar = await getNotificationsAvatars(notification);
                return notificationAvatar;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e); 
            }
        }
    },
};

module.exports = notification;
        