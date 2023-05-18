// const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');

const createNewStatus = {
    // Query: { 
    // },
    Mutation: {   
        async createNewStatus(context,{input}){ 
            try{
                let req=context.headers.authorization;
                const token = req.replace('Bearer ','');
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION ); 
                if (!authResponse.identification){
                    throw new GraphQLError('Please Authenticate');
                } 
                const formData={input}
                const mess= await fetchFunction(formData, process.env.NEW_STATUS);
                const statusResult=  {
                    room: input.room,
                    status: input.status
                  }
                return statusResult;
            }catch(e){
                throw new GraphQLError(e); 
            }
        } 
    }
};

module.exports = createNewStatus;
        