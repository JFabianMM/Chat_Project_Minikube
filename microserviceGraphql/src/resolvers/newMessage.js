const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const logger = require("../logger");
const validationFunction = require('../functions/validationFunction');

const newMessage = {
    Mutation: {
        async newMessage(context,{input}){ 
            try{ 
                if (input.message.trim().length != 0){
                    const authResponse = await validationFunction(context.headers.cookie);
                    let date = new Date();
                    let current_time = date.getHours()+':'+date.getMinutes();
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
                }else{
                    logger.log("error", 'blank');
                    throw new GraphQLError('blank');
                }
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }
        } 
    }
};

module.exports = newMessage;


