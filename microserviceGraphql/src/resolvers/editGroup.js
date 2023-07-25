const User = require('../models/user');
const { GraphQLError } = require('graphql');
const fetchFunction = require('../functions/fetchFunction');
const getGroupAvatars = require('../functions/getGroupAvatars');

const editGroup = {
    Mutation: {
        async editGroup(context,{input}){  
            try{
                let req=context.headers.authorization;
                const token = req.replace('Bearer ','');
                const authFormData={token}
                const authResponse= await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation' ); 
                if (!authResponse.identification){ 
                    throw new GraphQLError('Please Authenticate');
                } 
                const user = await User.findOne({ _id: authResponse.identification});
                const dataInput={
                    id:user._id,
                    group: input.group,
                    name: input.name
                }  
                const formData={input: dataInput}
                const group= await fetchFunction(formData, process.env.BACKEND_MICROSERVICE+'editgroup');
                const groupAvatar = await getGroupAvatars(group);
                return groupAvatar.groups
            }catch(e){
                throw new GraphQLError(e); 
            }
        } 
    }
};


module.exports = editGroup;
        