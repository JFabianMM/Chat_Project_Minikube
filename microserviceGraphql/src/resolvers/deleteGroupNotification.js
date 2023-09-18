const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const logger = require("../logger");
const fetchDeleteFunction= require('../functions/fetchDeleteFunction');
const fetchPatchFunction = require('../functions/fetchPatchFunction');

const deleteGroupNotification = {
    Mutation: {
        async deleteGroupNotification(context,{input}){ 
            try{
                let req=context.headers.cookie;
                const token = req.replace('token=','');
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                const room=input.group.room;
                console.log('room: ', room);
                const url = new URL(process.env.BACKEND_MICROSERVICE+'groupnotification');
                url.searchParams.set('room', room);
                url.searchParams.set('userId', authResponse.identification);
                const response= await fetchDeleteFunction(url.href);
                console.log('response: ', response);

                const dataInput={
                    id:authResponse.identification,
                    group: input.group,
                    name: input.name
                }  
                const formData={input: dataInput}
                const group= await fetchPatchFunction(formData, process.env.BACKEND_MICROSERVICE+'groupnotification');
                console.log('group: ', group);
                console.log('response.deleteNotificationResponse: ', response.deleteNotificationResponse);
                return response.deleteNotificationResponse;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }
        }
    }
};
module.exports = deleteGroupNotification;