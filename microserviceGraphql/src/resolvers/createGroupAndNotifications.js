const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const getGroupAvatars = require('../functions/getGroupAvatars');
const getUniqueListBy = require('../functions/getUniqueListBy');
const logger = require("../logger");

const createGroupAndNotifications = {
    Mutation: {
        async createGroupAndNotifications(context,{input}){
            try{
                let req=context.headers.cookie;
                const token = req.replace('token=',''); 
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
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
                const group= await fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'groupandnotifications');
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
        