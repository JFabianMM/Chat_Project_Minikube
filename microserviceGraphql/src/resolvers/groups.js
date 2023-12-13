const { GraphQLError } = require('graphql');
const {fetchGetFunction, getGroupAvatars, validationFunction} = require('../functions');
const logger = require("../logger");

const groups = {
    Query: { 
        async groups(context,args){
            try{
                const authResponse = await validationFunction(context.headers.cookie); 
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                }         
                const url = new URL('http://backend:4001/api/users/groups');
                url.searchParams.set('identification', authResponse.identification);
                const group= await fetchGetFunction(url.href);
                const groupAvatar = await getGroupAvatars(group);
                return groupAvatar.groups
            }catch(e){
                logger.log("error", e);
                throw new GraphQLError(e);
            }
        }
    },
};

module.exports = groups;
        