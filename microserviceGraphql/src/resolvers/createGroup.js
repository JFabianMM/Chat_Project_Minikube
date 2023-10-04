const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const getGroupAvatars = require('../functions/getGroupAvatars');
const getUniqueListBy = require('../functions/getUniqueListBy');
const validationFunction = require('../functions/validationFunction')
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
                const group= await fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'group');
                const groupAvatar = await getGroupAvatars(group);
                return groupAvatar.groups
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e); 
            }
        } 
    }
};

module.exports = createGroup;
        