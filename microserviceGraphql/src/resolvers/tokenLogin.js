const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const getContactAvatars = require('../functions/getContactAvatars');
const getGroupAvatars = require('../functions/getGroupAvatars');

const tokenLogin = {
    Query: { 
        async tokenLogin(context, args){
            let req=context.headers.authorization; 
            const token = req.replace('Bearer ','');
            const authFormData={token}
            const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
            if (!authResponse.identification){
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
                    const contactAvatar = await getContactAvatars(data.loginResponse.contact);
                    const groupAvatar = await getGroupAvatars(data.loginResponse.group);
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
                    throw new GraphQLError('Do not exist');
                }
            }catch(e){
                throw new GraphQLError(e);
            }
        },
    },
};

module.exports = tokenLogin;
        