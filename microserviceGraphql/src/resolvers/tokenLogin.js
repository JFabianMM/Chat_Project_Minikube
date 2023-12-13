const User = require('../models/user');
const { GraphQLError } = require('graphql');
const {fetchFunction, getContactAvatars, getGroupAvatars, validationFunction} = require('../functions');
const logger = require("../logger");

const tokenLogin = {
    Query: {             
        async tokenLogin(context, args){
            let authResponse = await validationFunction(context.headers.cookie);
            let req=context.headers.cookie;
            const token = req.replace('token=',''); 
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
                    const data= await fetchFunction(formData, 'http://backend:4001/api/users/login');
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
        
                    
                    
                    
