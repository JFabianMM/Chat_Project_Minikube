const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const logger = require("../logger");
const fetchDeleteFunction= require('../functions/fetchDeleteFunction');

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

                const url = new URL(process.env.BACKEND_MICROSERVICE+'groupnotification');
                url.searchParams.set('room', args.room);
                url.searchParams.set('userId', authResponse.identification);
                const response= await fetchDeleteFunction(url.href);
                return response.deleteNotificationResponse;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }
        }
    }
};
module.exports = deleteGroupNotification;