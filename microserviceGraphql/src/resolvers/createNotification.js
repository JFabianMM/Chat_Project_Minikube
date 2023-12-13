const { GraphQLError } = require('graphql');
const {fetchFunction, getContactAvatars, validationFunction} = require('../functions');
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
                const newcontact= await fetchFunction(formData, 'http://backend:4001/api/users/notification');
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
        
        