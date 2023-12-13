const User = require('../models/user');
const { GraphQLError } = require('graphql');
const {fetchFunction, validationFunction} = require('../functions');
const logger = require("../logger");

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
                const authResponse2= fetchFunction(formData, 'http://authorization:4002/api/users/update' );
                const userResponse2= fetchFunction(formData, 'http://backend:4001/api/users/update'); 
                return user;
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }
        } 
    }
};

module.exports = updateUserData;
        