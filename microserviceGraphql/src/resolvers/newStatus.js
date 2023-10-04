const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const logger = require("../logger");
const validationFunction = require('../functions/validationFunction');

const newStatus = {
    Mutation: {   
        async newStatus(context,{input}){ 
            try{
                const authResponse = await validationFunction(context.headers.cookie);
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                const formData={input}
                const status= await fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'status');
                const statusResult=  {
                    room: input.room,
                    status: input.status
                  }
                return statusResult;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e); 
            }
        } 
    }
};

module.exports = newStatus;