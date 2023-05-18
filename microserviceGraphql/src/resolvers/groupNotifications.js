const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const getGroupNotificationsAvatars=require('../functions/getGroupNotificationsAvatars');

const groupNotifications = {
    Query: { 
        async groupNotifications(context,args){
            try{
                let req=context.headers.authorization;
                const token = req.replace('Bearer ','');
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION ); 
                if (!authResponse.identification){
                    throw new GraphQLError('Please Authenticate');
                } 
                const user = await User.findOne({ _id: authResponse.identification});
                const formData={identification: user._id}
                const groupNotification= await fetchFunction(formData, process.env.GROUP_NOTIFICATIONS);
                const groupNotificationAvatar = await getGroupNotificationsAvatars(groupNotification);
                return groupNotificationAvatar.groupNotifications;
            }catch(e){
                throw new GraphQLError(e); 
            }            
        }
    },
    // Mutation: { 
    // }
};

module.exports = groupNotifications;
        