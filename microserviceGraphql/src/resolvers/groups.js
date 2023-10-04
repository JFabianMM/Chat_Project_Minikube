const { GraphQLError } = require('graphql');
const fetchGetFunction = require('../functions/fetchGetFunction');
const getGroupAvatars = require('../functions/getGroupAvatars');
const logger = require("../logger");
const validationFunction = require('../functions/validationFunction');

const groups = {
    Query: { 
        async groups(context,args){
            try{
                const authResponse = await validationFunction(context.headers.cookie); 
                if (!authResponse.identification){
                    logger.log("error", 'Please Authenticate');
                    throw new GraphQLError('Please Authenticate');
                }         
                
                const url = new URL(process.env.BACKEND_MICROSERVICE+'groups');
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
        