const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const logger = require("../logger");
const validationFunction = require('../functions/validationFunction');

const updateUserData = {
    Mutation: {
        async updateUserData(context, {input}){
            try{
                const authResponse = await validationFunction(context.headers.cookie);
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                let {password, firstName, lastName} = input;
                const user = await User.findOne({ _id: authResponse.identification});  
                const result = /^(?=.*[0-9])(?=.*[A-Z])(?!.* ).{6,80}$/.test(password);
                if (result==true){
                    user.password=password;;
                }            
                if (firstName.length <= 20 && firstName!=''){
                    user.firstName=firstName;
                }
                if (lastName.length <= 20 && lastName!=''){
                    user.lastName=lastName;
                }
                const formData={
                    password,
                    firstName,
                    lastName,
                    identification:authResponse.identification
                }
                user.save();
                const authResponse2= fetchFunction(formData, process.env.AUTHORIZATION_MICROSERVICE+'update' );
                const userResponse2= fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'update'); 
                return user;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }
        } 
    }
};

module.exports = updateUserData;
        