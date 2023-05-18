// const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const getContactAvatars = require('../functions/getContactAvatars');

const createContact = {
    // Query: { 
    // },
    Mutation: { 
        async createContact(context, {input}){
            try{
                let req=context.headers.authorization;
                const token = req.replace('Bearer ','');
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION ); 
                if (!authResponse.identification){ 
                    throw new GraphQLError('Please Authenticate');
                } 
                const formData={input}
                const newcontact= await fetchFunction(formData, process.env.NEW_CONTACT);
                let CreateContactResponse=newcontact.CreateContactResponse;
                const contactAvatar = await getContactAvatars(CreateContactResponse.user);
                CreateContactResponse.user=contactAvatar;
                return CreateContactResponse
            }catch(e){
                throw new GraphQLError(e);
            }
        } 
    }
};

module.exports = createContact;
        