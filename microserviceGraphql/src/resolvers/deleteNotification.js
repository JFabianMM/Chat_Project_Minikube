const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');

const deleteNotification = {
    // Query: { 
    // },
    Mutation: {
        async deleteNotification(context, args){
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
                    contactid: args.contactid,
                    userId: user._id
                } 
                const response= await fetchFunction(formData, process.env.NOTIFICATION_DELETION);
                return response.DeleteNotificationResponse;
            }catch(e){
                throw new GraphQLError(e); 
            }
        } 
    }
};

module.exports = deleteNotification;
        