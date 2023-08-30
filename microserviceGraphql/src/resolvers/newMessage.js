const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const logger = require("../logger");

const newMessage = {
    Mutation: {
        async newMessage(context,{input}){ 
            try{ 
                let req=context.headers.cookie;
                const token = req.replace('token=','');
                let date = new Date();
                let current_time = date.getHours()+':'+date.getMinutes();
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
                if (!authResponse.identification){ 
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                }
                const user = await User.findOne({ _id: authResponse.identification });
                input.id=authResponse.identification;
                input.firstName=user.firstName;
                input.lastName=user.lastName;
                const formData={input}
                const NewMessa= await fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'message');    
                const NewMessageResponse = {
                    id:authResponse.identification,
                    room: input.room,
                    origin: authResponse.identification,
                    firstName: input.firstName, 
                    lastName:  input.lastName,
                    message: input.message,
                    time: current_time 
                };
                return NewMessageResponse;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }
        } 
    }
};

module.exports = newMessage;

