const { GraphQLError } = require('graphql');
const {fetchFunction, getContactAvatars, validationFunction} = require('../functions');
const logger = require("../logger");

const createContact = {
    Mutation: { 
        async createContact(context, {input}){
            try{
                const authResponse = await validationFunction(context.headers.cookie); 
                if (!authResponse.identification){ 
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                const formData={
                    userid:authResponse.identification,
                    contactid:input.contactid,
                    room:input.room
                }
                const newcontact= await fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'contact');
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

module.exports = createContact;
           