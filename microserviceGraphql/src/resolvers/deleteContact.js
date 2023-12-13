const { GraphQLError } = require('graphql');
const {fetchDeleteFunction, validationFunction} = require('../functions');
const logger = require("../logger");

const deleteContact = {
    Mutation: {
        async deleteContact(context, {input}){
            try{
                const authResponse = await validationFunction(context.headers.cookie);          
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                const url = new URL('http://backend:4001/api/users/contact');
                url.searchParams.set('contactid', input.contactid);
                url.searchParams.set('userId', authResponse.identification);
                url.searchParams.set('room', input.room);
                const response= await fetchDeleteFunction(url.href);
                return response.DeleteContactResponse;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e); 
            }
        } 
    }
};

module.exports = deleteContact;