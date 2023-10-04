const User = require('../models/user');
const { GraphQLError } = require('graphql');
const logger = require("../logger");
const validationFunction = require('../functions/validationFunction');

const singleUpload = {
    Mutation: {  
        async singleUpload(context,{file}){
            try{
                const authResponse = await validationFunction(context.headers.cookie);
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                let user = await User.findOne({ _id: authResponse.identification});
                user.avatar = file;
                user.save();
                const result=  {result: 'fine'}
                return result;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }  
        } 
    }
};

module.exports = singleUpload;
        