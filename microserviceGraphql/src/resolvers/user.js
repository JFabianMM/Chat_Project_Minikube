const User = require('../models/user');
const { GraphQLError } = require('graphql');
const logger = require("../logger");
const {validationFunction} = require('../functions');

const user = {
    Query: {
        async user(context, args){             
            try{
                const authResponse = await validationFunction(context.headers.cookie); 
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                }
                let user; 
                if (args.email.trim().length !=0) {
                    user = await User.findOne({ email: args.email });
                }
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