const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');

const createNewMessage = {
    Mutation: {
        async createNewMessage(context,{input}){ 
            try{ 
                let date = new Date();
                let current_time = date.getHours()+':'+date.getMinutes();
                let req=context.headers.authorization;
                const token = req.replace('Bearer ','');
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
                if (!authResponse.identification){ 
                    throw new GraphQLError('Please Authenticate');
                }
                const user = await User.findOne({ _id: authResponse.identification });
                input.id=authResponse.identification;
                input.firstName=user.firstName;
                input.lastName=user.lastName;
                const formData={input}
                const NewMessa= await fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'newmessage');    
                const NewMessageResponse = {
                    id:authResponse.identification,
                    room: input.room,
                    idNumber: authResponse.identification,
                    origin: authResponse.identification,
                    firstName: input.firstName, 
                    lastName:  input.lastName,
                    position: 'rigth', 
                    message: input.message,
                    time: current_time 
                };
                return NewMessageResponse;
            }catch(e){
                throw new GraphQLError(e);
            }
        } 
    }
};

module.exports = createNewMessage;

