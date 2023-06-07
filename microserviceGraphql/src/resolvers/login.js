const User = require('../models/user');
const { GraphQLError } = require('graphql');
const findByCredentials = require('../functions/findByCredentials');
const fetchFunction = require('../functions/fetchFunction');
const getContactAvatars = require('../functions/getContactAvatars');
const getGroupAvatars = require('../functions/getGroupAvatars');

const login = {
    Query: {
            async login(_, {input}){
                console.log('input: ', input);
            let { email, password} = input;    
            try {
                const user = await findByCredentials(email, password);
                console.log('user: ', user);
                if (user!='Do not exist' && user!='Do not match'){
                    let idnumber= JSON.stringify(user._id);
                    const identification = idnumber.replaceAll('"', '');
                    const formData={
                        email,
                        password,
                        identification
                    }
                    console.log('formData: ', formData);
                    const authToken= await fetchFunction(formData, process.env.AUTHORIZATION_LOGIN);
                    console.log('authToken: ', authToken);
                    const data= await fetchFunction(formData, process.env.LOGIN);
                    console.log('data: ', data);
                    const token=authToken.token;
                    user.tokens = user.tokens.concat({ token });
                    const contactAvatar = await getContactAvatars(data.loginResponse.contact);
                    const groupAvatar = await getGroupAvatars(data.loginResponse.group);
                    let loginResponse = {
                        user,       
                        token,
                        contact: contactAvatar,
                        notification: data.loginResponse.notification,
                        groupNotification: data.loginResponse.groupNotification,
                        group: groupAvatar.groups,
                        messages: data.loginResponse.messages
                    }
                    console.log('loginResponse: ', loginResponse);
                    return loginResponse;
                }
                if (user=='Do not exist'){
                    throw new GraphQLError('Do not exist');
                }
                if (user=='Do not match'){
                    throw new GraphQLError('Do not match');
                }
            } catch (e){
                throw new GraphQLError(e);
            }  
        },
    },
    // Mutation: { 
    // }
};

module.exports = login;
        