const { GraphQLError } = require('graphql');
const {fetchFunction, getGroupAvatars, getUniqueListBy, validationFunction} = require('../functions');
const logger = require("../logger");

const createGroupAndNotifications = {
    Mutation: {
        async createGroupAndNotifications(context,{input}){
            try{
                const authResponse = await validationFunction(context.headers.cookie); 
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                } 
                let members = getUniqueListBy(input.group.members, 'id');

                const dataInput={
                    id:authResponse.identification, 
                    group: {
                        room:'',
                        members
                    },
                    name: input.name
                }
                const formData={input: dataInput }
                const group= await fetchFunction(formData, 'http://backend:4001/api/users/groupandnotifications');
                const groupAvatar = await getGroupAvatars(group);
                return groupAvatar.groups
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }
        } 
    }
};

module.exports = createGroupAndNotifications;
        