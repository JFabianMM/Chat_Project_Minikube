const { GraphQLError } = require('graphql');
const {fetchFunction, validationFunction} = require('../functions');
const logger = require("../logger");

const newLanguage = {
    Mutation: {
        async newLanguage(context,args){ 
            try{
                const authResponse = await validationFunction(context.headers.cookie); 
                if (!authResponse.identification){ 
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                }
                const formData={
                    language: args.language,
                    identification: authResponse.identification
                }    
                const result= fetchFunction(formData, 'http://backend:4001/api/users/language');
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