const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const logger = require("../logger");

const singleUpload = {
    Mutation: {  
        async singleUpload(context,{file}){
            try{
                let req=context.headers.cookie;
                const token = req.replace('token=','');
                const authFormData={token};
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
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
        