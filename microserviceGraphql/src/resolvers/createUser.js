const User = require('../models/user');
const { GraphQLError } = require('graphql');
const {fetchFunction} = require('../functions');
const logger = require("../logger");
const validator = require('validator');

const createUser = {
    Mutation: {
        async createUser(context, {input}){
            try{
                let {email, password, firstName, lastName} = input;
                const userValidation = await User.findOne({ email});
                if (!userValidation){
                    let errorFlag=0;
                    const result = /^(?=.*[0-9])(?=.*[A-Z])(?!.* ).{6,80}$/.test(password);
                    if (password == "" || firstName == "" || lastName == ""){
                        errorFlag=1;
                    }
                    if (result===false || !validator.isEmail(email)){
                        errorFlag=1;
                    }
                    if (firstName.length > 20){
                        errorFlag=1;
                    }
                    if (lastName.length > 20){
                        errorFlag=1;
                    }
                    if (password.length < 6){
                        errorFlag=1;
                    }
                    if (password.length > 80){
                        errorFlag=1;
                    }
                    if (errorFlag==1){
                        logger.log("error", 'Format Error');
                        throw new GraphQLError('Format Error');
                    }
                    const user = new User(input);
                    let idnumber= JSON.stringify(user._id);
                    const identification = idnumber.replaceAll('"', '');
                    const formData={
                        input,
                        identification
                    }
                    user.save();
                    const authResponse= fetchFunction(formData, process.env.AUTHORIZATION_MICROSERVICE+'register');
                    const userResponse= fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'register');
                    return user;  
                }else{
                    logger.log("error", 'User already exist');
                    throw new GraphQLError('User already exist'); 
                }
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }            
        } 
    }
};

module.exports = createUser;        