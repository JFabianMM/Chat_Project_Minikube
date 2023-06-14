const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');

const user = {
    Query: {
        async user(context, args){             
            try{
                let req=context.headers.authorization; 
                const token = req.replace('Bearer ','');
                const authFormData={token};
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
                if (!authResponse.identification){
                    throw new GraphQLError('Please Authenticate');
                } 
                const user = await User.findOne({ email: args.email });
                if (user){
                    return user
                }else{
                    throw new GraphQLError('User does not exist');
                }
            }catch(e){
                throw new GraphQLError(e);
            }
        }, 
    },
};

module.exports = user;
        