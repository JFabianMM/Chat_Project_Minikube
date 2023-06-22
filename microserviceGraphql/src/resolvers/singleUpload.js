const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');

const singleUpload = {
    Mutation: {  
        async singleUpload(context,{file}){
            try{
                let req=context.headers.authorization;
                const token = req.replace('Bearer ','');
                const authFormData={token};
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
                if (!authResponse.identification){
                    throw new GraphQLError('Please Authenticate');
                } 
                let user = await User.findOne({ _id: authResponse.identification});
                user.avatar = file;
                await user.save();
                const result=  {result: 'fine'}
                return result;
            }catch(e){
                throw new GraphQLError(e);
            }  
        } 
    }
};

module.exports = singleUpload;
        