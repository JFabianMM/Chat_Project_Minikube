const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const logger = require("../logger");

const newLanguage = {
    Mutation: {
        async newLanguage(context,args){ 
            try{
                let req=context.headers.cookie;
                const token = req.replace('token=','');
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
                if (!authResponse.identification){ 
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                }
                const formData={
                    language: args.language,
                    identification: authResponse.identification
                }    
                const result= fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'language');
                let languageResult=  {
                    language: args.language
                }
                return languageResult;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e); 
            }
        } 
    }
};

module.exports = newLanguage;