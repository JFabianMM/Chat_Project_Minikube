const { GraphQLError } = require('graphql');
const {fetchPatchFunction, getGroupAvatars, validationFunction} = require('../functions');
const logger = require("../logger");

const editGroup = {
    Mutation: {
        async editGroup(context,{input}){  
            try{
                const authResponse = await validationFunction(context.headers.cookie); 
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
                const group= await fetchPatchFunction(formData, 'http://backend:4001/api/users/group');
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
        