const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const logger = require("../logger");

const user = {
    Query: {
        async user(context, args){             
            try{
                let req=context.headers.cookie;
                const token = req.replace('token=','');
                const authFormData={token};
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                const user = await User.findOne({ email: args.email });
                if (user){
                    if (user._id!=authResponse.identification){
                        return user
                    }else{
                        logger.log("error", 'User does not exist');
                        throw new GraphQLError('User does not exist');
                    }
                }else{
                    logger.log("error", 'User does not exist');
                    throw new GraphQLError('User does not exist');
                }
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }
        }, 
    },
};

module.exports = user;
        