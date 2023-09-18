const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const fetchPatchFunction = require('../functions/fetchPatchFunction');
const getGroupAvatars = require('../functions/getGroupAvatars');
const logger = require("../logger");

const editGroup = {
    Mutation: {
        async editGroup(context,{input}){  
            try{
                let req=context.headers.cookie;
                const token = req.replace('token=','');
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
                if (!authResponse.identification){ 
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                const dataInput={
                    id:authResponse.identification,
                    group: input.group,
                    name: input.name
                }  
                const formData={input: dataInput}
                const group= await fetchPatchFunction(formData, process.env.BACKEND_MICROSERVICE+'group');
                const groupAvatar = await getGroupAvatars(group);
                return groupAvatar.groups
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e); 
            }
        } 
    }
};

module.exports = editGroup;
        