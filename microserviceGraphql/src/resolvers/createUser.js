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
                    const user = new User(input);
                    let idnumber= JSON.stringify(user._id);
                    const identification = idnumber.replaceAll('"', '');
                    const formData={
                        input,
                        identification
                    }
                    user.save();

                    let errorFlag=0;
                    const result = /^(?=.*[0-9])(?=.*[A-Z])(?!.* ).{6,80}$/.test(password);
                    if (password == "" || firstName == "" || lastName == "" || lastName.length > 20 || firstName.length > 20){
                        errorFlag=1;
                    }
                    if (result===false || !validator.isEmail(email)){
                        errorFlag=1;
                    }
                    if (errorFlag==1){
                        logger.log("error", 'Format Error');
                        throw new GraphQLError('Format Error');
                    }
                    const authResponse= fetchFunction(formData, 'http://authorization:4002/api/users/register' );
                    const userResponse= fetchFunction(formData, 'http://backend:4001/api/users/register');
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
        