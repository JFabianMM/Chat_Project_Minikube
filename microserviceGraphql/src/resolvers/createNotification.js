const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const getContactAvatars = require('../functions/getContactAvatars');
const validationFunction = require('../functions/validationFunction');
const logger = require("../logger");


const createNotification = {
    Mutation: {    
        async createNotification(context, args){
            try{
                const authResponse = await validationFunction(context.headers.cookie); 
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                }  
                const formData={
                    id: args.id,
                    userId: authResponse.identification
                }
                const newcontact= await fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'notification');
                let CreateContactResponse=newcontact.CreateContactResponse;
                const contactAvatar = await getContactAvatars(CreateContactResponse.user);
                CreateContactResponse.user=contactAvatar;
                return CreateContactResponse
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }
        } 
    }
};

module.exports = createNotification;
        
        