const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const logger = require("../logger");

const deleteGroupNotification = {
    Mutation: {
        async deleteGroupNotification(context,args){
            try{
                let req=context.headers.cookie;
                const token = req.replace('token=','');
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                const formData={
                    room: args.room,
                    userId: authResponse.identification
                } 
                const response= await fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'groupnotificationdeletion'); 
                return response.DeleteNotificationResponse;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }
        }
    }
};

module.exports = deleteGroupNotification;
        