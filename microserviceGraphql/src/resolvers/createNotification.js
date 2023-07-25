const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const getContactAvatars = require('../functions/getContactAvatars');


const createNotification = {
    Mutation: {    
        async createNotification(context, args){
            try{
                let req=context.headers.authorization;
                const token = req.replace('Bearer ',''); 
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
                if (!authResponse.identification){
                    throw new GraphQLError('Please Authenticate');
                }  
                const user = await User.findOne({ _id: authResponse.identification});
                const formData={
                    id: args.id,
                    userId: user._id
                }
                const newcontact= await fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'newnotification');
                let CreateContactResponse=newcontact.CreateContactResponse;
                const contactAvatar = await getContactAvatars(CreateContactResponse.user);
                CreateContactResponse.user=contactAvatar;
                return CreateContactResponse
            }catch(e){
                throw new GraphQLError(e);
            }
        } 
    }
};

module.exports = createNotification;
        
        