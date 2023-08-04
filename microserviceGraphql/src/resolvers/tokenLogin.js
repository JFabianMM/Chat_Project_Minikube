const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const getContactAvatars = require('../functions/getContactAvatars');
const getGroupAvatars = require('../functions/getGroupAvatars');
const logger = require("../logger");

const tokenLogin = {
    Query: { 
        async tokenLogin(context, args){
            let req=context.headers.cookie;
            const token = req.replace('token=','');
            const authFormData={token}
            const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
            if (!authResponse.identification){
                logger.log("error", 'Please Authenticate');
                throw new GraphQLError('Please Authenticate');
            } 
            const user = await User.findOne({ _id: authResponse.identification});
            try{  
                if (user){    
                    const formData={
                        email: user.email,
                        password: 'password',
                        identification: user._id
                    }
                    const data= await fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'login');
                    const [contactAvatar, groupAvatar] = await Promise.all([getContactAvatars(data.loginResponse.contact),getGroupAvatars(data.loginResponse.group)]);
                    let loginResponse = {
                        user,
                        token,
                        language: data.loginResponse.language,
                        contact:contactAvatar,
                        notification: data.loginResponse.notification,
                        groupNotification: data.loginResponse.groupNotification,
                        group: groupAvatar.groups,
                        messages: data.loginResponse.messages
                    }
                    return loginResponse;
                }   
                if (!user){
                    logger.log("error", 'User does not exist');
                    throw new GraphQLError('Do not exist');
                }
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }
        },
    },
};

module.exports = tokenLogin;
        