const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const getNotificationsAvatars= require('../functions/getNotificationsAvatars');

const notification = {
    Query: { 
        async notification(context, args){ 
            try{
                let req=context.headers.authorization;
                const token = req.replace('Bearer ','');
                const authFormData={token};
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION ); 
                if (!authResponse.identification){
                    throw new GraphQLError('Please Authenticate');
                } 
                const user = await User.findOne({ _id: authResponse.identification});
                const formData={identification: user._id}
                const notification= await fetchFunction(formData, process.env.NOTIFICATION);
                const notificationAvatar = await getNotificationsAvatars(notification);
                return notificationAvatar;
            }catch(e){
                throw new GraphQLError(e); 
            }
        }
    },
    // Mutation: { 
    // }
};

module.exports = notification;
        