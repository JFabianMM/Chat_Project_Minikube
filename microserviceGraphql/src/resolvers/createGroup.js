const { GraphQLError } = require('graphql');
const {fetchFunction, getGroupAvatars, getUniqueListBy, validationFunction} = require('../functions');
const logger = require("../logger");

const createGroup = {
    Mutation: {
        async createGroup(context,{input}){  
            try{
                const authResponse = await validationFunction(context.headers.cookie); 
                if (!authResponse.identification){ 
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                }  
                let inputGroup=input.group;
                inputGroup.members = getUniqueListBy(inputGroup.members, 'id');
                const dataInput={
                    id:authResponse.identification, 
                    group: inputGroup,
                    name: input.name
                } 
                
                const formData={input: dataInput}
                const data= await fetchFunction(formData, 'http://backend:4001/api/users/group');
                let len=data.response.len;                
                const groupAvatar = await getGroupAvatars(data.response.group);
                let createGroupResponse = {
                    group: groupAvatar.groups,
                    len: len
                }
                return createGroupResponse
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e); 
            }
        } 
    }
};

module.exports = createGroup;
        