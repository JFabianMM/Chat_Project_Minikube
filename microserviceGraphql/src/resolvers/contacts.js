const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const getContactAvatars = require('../functions/getContactAvatars');

const contacts = {
    Query: { 
        async contacts(context, args){
            try{
                let req=context.headers.authorization;
                const token = req.replace('Bearer ','');
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION ); 
                if (!authResponse.identification){ 
                    throw new GraphQLError('Please Authenticate');
                } 
                const user = await User.findOne({ _id: authResponse.identification});
                const formData={identification: user._id}
                console.log('formData: ', formData);
                const contact= await fetchFunction(formData, process.env.CONTACT);
                console.log('contact: ', contact);
                if (contact){
                    const contactAvatar = await getContactAvatars(contact);
                    console.log('contactAvatar: ', contactAvatar);
                    return contactAvatar;
                }else{
                    throw new GraphQLError('Information not available');
                }
            }catch(e){
                throw new GraphQLError(e); 
            }  
        },

    },
    // Mutation: {
    // }
};

module.exports = contacts;
        