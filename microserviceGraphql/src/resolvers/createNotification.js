const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');

const createNotification = {
    // Query: { 
    // },
    Mutation: {    
        async createNotification(context, args){
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
                    id: args.id,
                    userId: user._id
                }
                const notification= await fetchFunction(formData, process.env.NEW_NOTIFICATION);
                return notification;
            }catch(e){
                throw new GraphQLError(e);
            }
        } 
    }
};

module.exports = createNotification;
        