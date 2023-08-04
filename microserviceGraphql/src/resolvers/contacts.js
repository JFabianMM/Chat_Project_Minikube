const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const getContactAvatars = require('../functions/getContactAvatars');
const logger = require("../logger");

const contacts = {
    Query: { 
        async contacts(context, args){
            try{
                let req=context.headers.cookie;
                const token = req.replace('token=','');
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation'); 
                if (!authResponse.identification){ 
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                const user = await User.findOne({ _id: authResponse.identification});
                const formData={identification: user._id}
                const contact= await fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'contact');    
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
        