const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');

const deleteGroupNotification = {
    // Query: { 
    // },
    Mutation: {
        async deleteGroupNotification(context,args){
            try{
                let req=context.headers.authorization;
                const token = req.replace('Bearer ','');
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION ); 
                if (!authResponse.identification){
                    throw new GraphQLError('Please Authenticate');
                } 
                const user = await User.findOne({ _id: authResponse.identification});
                const formData={
                    room: args.room,
                    userId: user._id
                } 
                const response= await fetchFunction(formData, process.env.GROUP_NOTIFICATION_DELETION ); 
                return response.DeleteNotificationResponse;
            }catch(e){
                throw new GraphQLError(e);
            }
        }
    }
};

module.exports = deleteGroupNotification;
        