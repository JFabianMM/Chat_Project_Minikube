const User = require('../models/user');
const { GraphQLError } = require('graphql');
const {fetchGetFunction, getContactAvatars, validationFunction} = require('../functions');
const logger = require("../logger");

const contacts = {
    Query: { 
        async contacts(context, args){
            try{
                const authResponse= await validationFunction(context.headers.cookie);         
                if (!authResponse.identification){ 
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                const user = await User.findOne({ _id: authResponse.identification});

                const url = new URL('http://backend:4001/api/users/contact');
                url.searchParams.set('identification', user._id);
                const contact= await fetchGetFunction(url.href); 
                if (contact){
                    const contactAvatar = await getContactAvatars(contact);
                    return contactAvatar;
                }else{
                    logger.log("error", 'Information not available');
                    throw new GraphQLError('Information not available');
                }
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e); 
            }  
        },
    },
};

module.exports = contacts;
        