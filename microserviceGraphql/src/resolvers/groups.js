const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const fetchGetFunction = require('../functions/fetchGetFunction');
const getGroupAvatars = require('../functions/getGroupAvatars');
const logger = require("../logger");

const groups = {
    Query: { 
        async groups(context,args){
            try{
                let req=context.headers.cookie;
                const token = req.replace('token=','');
                const authFormData={token};
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
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
        