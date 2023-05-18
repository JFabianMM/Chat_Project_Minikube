const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');

const updateUserData = {
    // Query: { 
    // },
    Mutation: {
        async updateUserData(context, {input}){
            let req=context.headers.authorization;
            const token = req.replace('Bearer ','');
            const authFormData={token};
            const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION ); 
            if (!authResponse.identification){
                throw new GraphQLError('Please Authenticate');
            } 
            let {email, password, firstName, lastName} = input;
            if (email!=''){
                const findemail = await User.findOne({ email});
                if (!findemail){
                    user.email=email;
                }else{
                    throw new GraphQLError('User already exist'); 
                }
            }
            if (password!=''){user.password=password;}
            if (firstName!=''){user.firstName=firstName;}
            if (lastName!=''){user.lastName=lastName;} 
            user.save();  
            return user;
        } 
    }
};

module.exports = updateUserData;
        