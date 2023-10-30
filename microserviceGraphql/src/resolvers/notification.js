const { GraphQLError } = require('graphql');
const {fetchGetFunction, getNotificationsAvatars, validationFunction} = require('../functions');
const logger = require("../logger");

const notification = {
    Query: { 
        async notification(context, args){ 
            try{
                const authResponse = await validationFunction(context.headers.cookie);
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
        