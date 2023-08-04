const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const logger = require("../logger");

const updateUserData = {
    Mutation: {
        async updateUserData(context, {input}){
            try{
                let req=context.headers.cookie;
                const token = req.replace('token=','');
                const authFormData={token};
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                let {email, password, firstName, lastName} = input;
                if (email!=''){
                    const findemail = await User.findOne({ email});
                    if (!findemail){
                        user.email=email;
                    }else{
                        logger.log("error", 'User already exist');
                        throw new GraphQLError('User already exist'); 
                    }
                }
                if (password!=''){user.password=password;}
                if (firstName!=''){user.firstName=firstName;}
                if (lastName!=''){user.lastName=lastName;} 
                user.save();  
                return user;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }
        } 
    }
};

module.exports = updateUserData;
        