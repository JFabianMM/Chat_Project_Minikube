// const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');

const createNewMessage = {
    // Query: { 
    // },
    Mutation: {
        async createNewMessage(context,{input}){ 
            try{ 
                let req=context.headers.authorization;
                const token = req.replace('Bearer ','');
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION ); 
                if (!authResponse.identification){ 
                    throw new GraphQLError('Please Authenticate');
                } 
                const formData={input}
                const mess= await fetchFunction(formData, process.env.NEW_MESSAGE );
                const result=  {result: input.room}    
                return result;
            }catch(e){
                throw new GraphQLError(e);
            }
        } 
    }
};

module.exports = createNewMessage;
        