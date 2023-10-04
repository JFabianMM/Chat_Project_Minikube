const User = require('../models/user');
const { GraphQLError } = require('graphql');
const logger = require("../logger");
const fetchDeleteFunction= require('../functions/fetchDeleteFunction');
const fetchPatchFunction = require('../functions/fetchPatchFunction');
const validationFunction = require('../functions/validationFunction');

const deleteGroupNotification = {
    Mutation: {
        async deleteGroupNotification(context,{input}){ 
            try{
                const authResponse = await validationFunction(context.headers.cookie);  
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                const room=input.group.room;
                const url = new URL(process.env.BACKEND_MICROSERVICE+'groupnotification');
                url.searchParams.set('room', room);
                url.searchParams.set('userId', authResponse.identification);
                const response= await fetchDeleteFunction(url.href);

                const dataInput={
                    id:authResponse.identification,
                    group: input.group,
                    name: input.name
                }  
                const formData={input: dataInput}
                const group= await fetchPatchFunction(formData, process.env.BACKEND_MICROSERVICE+'groupnotification');
                return response.deleteNotificationResponse;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }
        }
    }
};
module.exports = deleteGroupNotification;