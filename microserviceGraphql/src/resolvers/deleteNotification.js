const { GraphQLError } = require('graphql');
const {fetchDeleteFunction, validationFunction} = require('../functions');
const logger = require("../logger");

const deleteNotification = {
    Mutation: {
        async deleteNotification(context, {input}){
            try{
                const authResponse = await validationFunction(context.headers.cookie); 
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 

                const url = new URL(process.env.BACKEND_MICROSERVICE+'notification');
                url.searchParams.set('contactid', input.contactid);
                url.searchParams.set('userId', authResponse.identification);
                url.searchParams.set('room', input.room);
                const response= await fetchDeleteFunction(url.href);

                return response.DeleteNotificationResponse;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e); 
            }
        } 
    }
};

module.exports = deleteNotification;